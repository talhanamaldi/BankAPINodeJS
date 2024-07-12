const db = require('../models');
const Account = db.Account;
const User = db.User;
const Bank = db.Bank;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      include: [
        { model: User, attributes: ['name'], as: 'User' },
        { model: Bank, attributes: ['name'], as: 'Bank' }
      ]
    });
const formattedResponse = accounts.map(account => ({
  account_id: account.account_id,
  User: account.User ? account.User.name : null,
  Bank: account.Bank ? account.Bank.name : null,
  balance: account.balance,
}));

res.send(formattedResponse);

  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while retrieving accounts." });
  }
};