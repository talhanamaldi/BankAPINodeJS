const db = require('../models');
const Transaction = db.Transaction;
const Account = db.Account;
const User = db.User;
const Bank = db.Bank;
const Op = db.Sequelize.Op;

// Create and Save a new Transaction
exports.create = async (req, res) => {
  const { sender_account_id, receiver_account_id, amount } = req.body;

  res.addSpanData(req.body,'http.request.body')

  try {
    const [senderAccount, receiverAccount] = await Promise.all([
      Account.findOne({
        where: { account_id: sender_account_id },
        include: [
          { model: User },
          { model: Bank }
        ]
      }),
      Account.findOne({
        where: { account_id: receiver_account_id },
        include: [
          { model: User },
          { model: Bank }
        ]
      })
    ]);
if (!senderAccount && !receiverAccount) {
  const errorMessage = {
    error_no : 201,
    error_description : `Sender with id=${sender_account_id} and Receiver with id=${receiver_account_id} accounts not found while transaction`,
    error_info : {}
  }
  res.addSpanData(errorMessage,'http.response.error');
  return res.status(201).send({ message: `Sender with id=${sender_account_id} and Receiver with id=${receiver_account_id} accounts not found while transaction` });
}else if(!senderAccount){
  const errorMessage = {
    error_no : 201,
    error_description : `Sender account with id=${sender_account_id} not found while transaction`,
    error_info : {}
  }
  res.addSpanData(errorMessage,'http.response.error');
  return res.status(201).send({ message: `Sender account with id=${sender_account_id} not found while transaction` });
}else if(!receiverAccount){
  const errorMessage = {
    error_no : 201,
    error_description : `Receiver account with id=${receiver_account_id} not found while transaction`,
    error_info : {}
  }
  res.addSpanData(errorMessage,'http.response.error');
  return res.status(201).send({ message: `Receiver account with id=${receiver_account_id} not found while transaction`});
}

if (senderAccount.balance < amount) {
  const errorMessage = {
    error_no : 201,
    error_description : `Account ${sender_account_id} Insufficient balance while transaction`,
    error_info : {account:senderAccount}

  }
  res.addSpanData(errorMessage,'http.response.error');
  return res.status(201).send({ message: "Insufficient balance" });
}

const transaction = await Transaction.create({
  sender_account_id,
  receiver_account_id,
  amount,
  transaction_time: new Date(),
});

// Update balances
await Promise.all([
  senderAccount.update({ balance: senderAccount.balance - amount }),
  receiverAccount.update({ balance: receiverAccount.balance + amount })
]);

const formattedResponse = {
  transaction_id: transaction.transaction_id,
  senderAccount: senderAccount,
  receiverAccount: receiverAccount,
  amount: transaction.amount,
  transaction_time: transaction.transaction_time
};

res.addSpanData(formattedResponse,'http.response.post');
res.send(formattedResponse);

  } catch (error) {
    res.status(400).send({ message: error.message || "Some error occurred while creating the Transaction." });
  }
};



exports.withdraw = async (req, res) => {

  const id = req.params.id;
  let {amount} = req.body;
  amount = parseInt(amount);

  const account = await Account.findByPk(id,{
      include: [
          {model: User,as: 'User'},
          {model: Bank,as: 'Bank'}
        ]
  });
  if (!account) {
    const errorMessage = {
      error_no : 201,
      error_description : `Account with id=${id} not found while withdraw.` ,
      error_info : {}
    }
    res.addSpanData(errorMessage,'http.response.error');
    return res.status(201).send({ message: `Account with id=${id} not found.` });
  }

  if (account.balance < amount) {
    const errorMessage = {
      error_no : 201,
      error_description : `Account ${id} Insufficient balance while withdraw`,
      error_info : {account: account}
    }
    res.addSpanData(errorMessage,'http.response.error');
    return res.status(201).send({ message: `Account ${id} Insufficient balance while withdraw`});
  }

try{
  


  const [updated] = await Account.update({balance: (account.balance-amount)}, { where: { account_id: id } });


  if (updated) {

    const transaction = await Transaction.create({
      sender_account_id: id,
      receiver_account_id: id,
      amount: amount,
      transaction_time: new Date(),
    });


      const formattedResponse = {
        transaction_id: transaction.transaction_id,
        senderAccount: account,
        receiverAccount: account,
        amount: amount,
        transaction_time: transaction.transaction_time
        };

      res.addSpanData(formattedResponse,"http.response.post")
      res.send(formattedResponse);

  }else{
      res.status(400).send({ message: `Cannot update Account.` });
  }

}catch (error) {
    res.status(400).send({ message: error.message || "Some error occurred while updating the Account." });
}


};



exports.deposit = async (req, res) => {

  const id = req.params.id;
  let {amount} = req.body;
  amount = parseInt(amount);

  console.log("amount = " +amount);

  const account = await Account.findByPk(id,{
      include: [
          {model: User,as: 'User'},
          {model: Bank,as: 'Bank'}
        ]
  });

  if (!account) {
    const errorMessage = {
      error_no : 201,
      error_description : `Account with id=${id} not found while deposit.` ,
      error_info : {}
    }
    res.addSpanData(errorMessage,'http.response.error');
    return res.status(201).send({ message: `Account with id=${id} not found.` });
  }

try{



  const [updated] = await Account.update({balance: (account.balance+amount)}, { where: { account_id: id } });



  if (updated) {

    const transaction = await Transaction.create({
      sender_account_id: id,
      receiver_account_id: id,
      amount: amount,
      transaction_time: new Date(),
    });

    const formattedResponse = {
      transaction_id: transaction.transaction_id,
      senderAccount: account,
      receiverAccount: account,
      amount: amount,
      transaction_time: transaction.transaction_time
      };
      res.addSpanData(formattedResponse,"http.response.post")
      res.send(formattedResponse);

  }else{
      res.status(400).send({ message: `Cannot update Account.` });
  }

}catch (error) {
    res.status(400).send({ message: error.message || "Some error occurred while updating the Account." });
}


};






// Retrieve all Transactions
exports.findAll = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Account,
          as: 'SenderAccount',
          include: [
            { model: User, attributes: ['name'] },
            { model: Bank, attributes: ['name'] }
          ]
        },
        {
          model: Account,
          as: 'ReceiverAccount',
          include: [
            { model: User, attributes: ['name'] },
            { model: Bank, attributes: ['name'] }
          ]
        }
      ]
    });
const formattedResponse = transactions.map(transaction => ({
  transaction_id: transaction.transaction_id,
  SenderAccount: transaction.SenderAccount
    ? {
        user: transaction.SenderAccount.User.name,
        bank: transaction.SenderAccount.Bank.name,
        balance: transaction.SenderAccount.balance
      }
    : null,
  ReceiverAccount: transaction.ReceiverAccount
    ? {
        user: transaction.ReceiverAccount.User.name,
        bank: transaction.ReceiverAccount.Bank.name,
        balance: transaction.ReceiverAccount.balance
      }
    : null,
  amount: transaction.amount,
}));

res.send(formattedResponse);

  } catch (error) {
    res.status(400).send({ message: error.message || "Some error occurred while retrieving transactions." });
  }
};


// Find a single Transaction with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: Account,
          as: 'SenderAccount',
          include: [
            { model: User, attributes: ['name'] },
            { model: Bank, attributes: ['name'] }
          ]
        },
        {
          model: Account,
          as: 'ReceiverAccount',
          include: [
            { model: User, attributes: ['name'] },
            { model: Bank, attributes: ['name'] }
          ]
        }
      ]
    });
if (!transaction) {
  const errorMessage = {
    error_no : 201,
    message : `Transaction with id=${id} not found.` 
  }
  res.addSpanData(errorMessage,'http.response.error');
  return res.status(201).send({ message: `Transaction with id=${id} not found.` });
}

const formattedResponse = {
  transaction_id: transaction.transaction_id,
  SenderAccount: transaction.SenderAccount
    ? {
        user: transaction.SenderAccount.User.name,
        bank: transaction.SenderAccount.Bank.name,
        balance: transaction.SenderAccount.balance
      }
    : null,
  ReceiverAccount: transaction.ReceiverAccount
    ? {
        user: transaction.ReceiverAccount.User.name,
        bank: transaction.ReceiverAccount.Bank.name,
        balance: transaction.ReceiverAccount.balance
      }
    : null,
  amount: transaction.amount,
};

res.send(formattedResponse);

  } catch (error) {
    res.status(400).send({ message: error.message || `Error retrieving Transaction with id=${id}` });
  }
};

exports.findAccounts = async(req,res) => {
  const id = req.params.id;

  try {
    const transactions = await Transaction.findAll({
      where: {
        sender_account_id: id
      },
      include: [
        {
          model: Account,
          as: 'SenderAccount',
          include: [
            { model: User, attributes: ['name'] },
            { model: Bank, attributes: ['name'] }
          ]
        },
        {
          model: Account,
          as: 'ReceiverAccount',
          include: [
            { model: User, attributes: ['name'] },
            { model: Bank, attributes: ['name'] }
          ]
        }
      ]
  
    });
  
    if (!transactions) {
      const errorMessage = {
        error_no : 201,
        message : `No transaction found with Accout id=${id}.` 
      }
      res.addSpanData(errorMessage,'http.response.error');
      return res.status(201).send({ message: `Transaction with id=${id} not found.` });
    }

    const formattedResponse = transactions.map(transaction => ({
      transaction_id: transaction.transaction_id,
      SenderAccount: transaction.SenderAccount
        ? {
            user: transaction.SenderAccount.User.name,
            bank: transaction.SenderAccount.Bank.name,
            balance: transaction.SenderAccount.balance
          }
        : null,
      ReceiverAccount: transaction.ReceiverAccount
        ? {
            user: transaction.ReceiverAccount.User.name,
            bank: transaction.ReceiverAccount.Bank.name,
            balance: transaction.ReceiverAccount.balance
          }
        : null,
      amount: transaction.amount,
    }));

  res.send(formattedResponse);

  } catch (error) {
    res.status(400).send({ message: error.message || `Error retrieving Transaction with id=${id}` });
  }


}

// Update a Transaction by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [updated] = await Transaction.update(req.body, { where: { transaction_id: id } });
    if (updated) {
      const updatedTransaction = await Transaction.findByPk(id, {
        include: [
          {
            model: Account,
            as: 'SenderAccount',
            include: [
              { model: User, attributes: ['name'] },
              { model: Bank, attributes: ['name'] }
            ]
          },
          {
            model: Account,
            as: 'ReceiverAccount',
            include: [
              { model: User, attributes: ['name'] },
              { model: Bank, attributes: ['name'] }
            ]
          }
        ]
      });
  const formattedResponse = {
    transaction_id: updatedTransaction.transaction_id,
    SenderAccount: updatedTransaction.SenderAccount
      ? {
          user: updatedTransaction.SenderAccount.User.name,
          bank: updatedTransaction.SenderAccount.Bank.name,
          balance: updatedTransaction.SenderAccount.balance
        }
      : null,
    ReceiverAccount: updatedTransaction.ReceiverAccount
      ? {
          user: updatedTransaction.ReceiverAccount.User.name,
          bank: updatedTransaction.ReceiverAccount.Bank.name,
          balance: updatedTransaction.ReceiverAccount.balance
        }
      : null,
    amount: updatedTransaction.amount,
  };

  res.send(formattedResponse);
} else {
  const errorMessage = {
    error_no : 201,
    message : `Cannot update Transaction with id=${id}. Maybe Transaction was not found or req.body is empty!`
  }
  res.addSpanData(errorMessage,'http.response.error');
  res.status(201).send({ message: `Cannot update Transaction with id=${id}. Maybe Transaction was not found or req.body is empty!` });
}

  } catch (error) {
    res.status(400).send({ message: error.message || `Error updating Transaction with id=${id}` });
  }
};

// Delete a Transaction with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const transaction = await Transaction.findByPk(id);

  if(transaction){

  try {
    const deleted = await Transaction.destroy({ where: { transaction_id: id } });
    if (deleted) {
      res.send({ message: "Transaction was deleted successfully!" });
    } 
  } catch (error) {
    res.status(400).send({ message: `Could not delete Transaction with id=${id}` });
  }
}else {
  const errorMessage = {
    error_no : 201,
    message : `Cannot delete Transaction with id=${id}.Transaction was not found!`
  }
  res.addSpanData(errorMessage,'http.response.error');
  res.status(201).send({ message: `Cannot delete Transaction with id=${id}.Transaction was not found!` });
}
};

// Delete all Transactions from the database
exports.deleteAll = async (req, res) => {
  try {
    const deleted = await Transaction.destroy({ where: {}, truncate: false });
    res.send({ message: `${deleted} Transactions were deleted successfully!` });
  } catch (error) {
    res.status(400).send({ message: error.message || "Some error occurred while removing all transactions." });
  }
};
