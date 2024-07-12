const db = require('../models');
const Transaction = db.Transaction;
const Account = db.Account;
const User = db.User;
const Op = db.Sequelize.Op;
const { context, trace } = require ("@opentelemetry/api");

// Create and Save a new Transaction
exports.create = async (req, res) => {
  const { user_id, user2_id, amount } = req.body;

  try {

    const [senderAccount, receiverAccount] = await Promise.all([
      Account.findOne({
        where: { user_id:user_id },
        include: [{ model: User, attributes: ['name'] }]
      }),
      Account.findOne({
        where: { user_id: user2_id },
        include: [{ model: User, attributes: ['name'] }]
      })
    ]);
if (!senderAccount || !receiverAccount) {
  return res.status(404).send({ message: "Sender or Receiver account not found" });
}

if (senderAccount.balance < amount) {
  return res.status(400).send({ message: "Insufficient balance" });
}

const transaction = await Transaction.create({ user_id, user2_id, amount });

// Update balances
await Promise.all([
  senderAccount.update({ balance: senderAccount.balance - amount }),
  receiverAccount.update({ balance: receiverAccount.balance + amount })
]);

const formattedResponse = {
  transaction_id: transaction.transaction_id,
  User: senderAccount.User,
  User2: receiverAccount.User,
  amount: transaction.amount,
};

res.send(formattedResponse);

  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while creating the Transaction." });
  }
};

// Retrieve all Transactions
exports.findAll = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: User, as: 'Sender', attributes: ['name'] },
        { model: User, as: 'Receiver', attributes: ['name'] }
      ]
    });
const formattedResponse = transactions.map(transaction => ({
  transaction_id: transaction.transaction_id,
  Sender: transaction.Sender ? transaction.Sender.name : null,
  Receiver: transaction.Receiver ? transaction.Receiver.name : null,
  amount: transaction.amount,
}));

res.send(formattedResponse);

  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while retrieving transactions." });
  }
};

// Find a single Transaction with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).send({ message: `Transaction with id=${id} not found.` });
    }
    const sender = await User.findOne({ where: { user_id:transaction.user_id } });
    const receiver = await User.findOne({ where: { user_id:transaction.user2_id } });


    const formattedResponse = {
      transaction_id: transaction.transaction_id,
      user_name: sender,
      user2_name: receiver,
      amount: transaction.amount,
    };

    res.send(formattedResponse);
  } catch (error) {
    res.status(500).send({ message: `Error retrieving Transaction with id=${id}` });
  }
};

// Update a Transaction by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [updated] = await Transaction.update(req.body, { where: { transaction_id: id } });
    if (updated) {
      const updatedTransaction = await Transaction.findByPk(id);
      
      res.send(updatedTransaction);
    } else {
      res.status(404).send({ message: `Cannot update Transaction with id=${id}. Maybe Transaction was not found or req.body is empty!` });
    }
  } catch (error) {
    res.status(500).send({ message: `Error updating Transaction with id=${id}` });
  }
};

// Delete a Transaction with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await Transaction.destroy({ where: { transaction_id: id } });
    if (deleted) {
      res.send({ message: "Transaction was deleted successfully!" });
    } else {
      res.status(404).send({ message: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!` });
    }
  } catch (error) {
    res.status(500).send({ message: `Could not delete Transaction with id=${id}` });
  }
};

// Delete all Transactions from the database
exports.deleteAll = async (req, res) => {
  try {
    const deleted = await Transaction.destroy({ where: {}, truncate: false });
    res.send({ message: `${deleted} Transactions were deleted successfully!` });
  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while removing all transactions." });
  }
};