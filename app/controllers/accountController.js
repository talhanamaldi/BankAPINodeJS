const db = require('../models');
const Account = db.Account;
const User = db.User;
const Bank = db.Bank;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
    try {
      const accounts = await Account.findAll();

      const formattedResponse = await Promise.all(accounts.map(async (account) => {
        const userName = await User.findOne({ where: { user_id: account.user_id } });
        const bankName = await Bank.findOne({ where: { bank_id: account.bank_id } });
      
        return {
          account_id: account.account_id,
          User: userName,
          Bank: bankName,
          balance: account.balance,
        };
      }));
      
      res.send(formattedResponse);


    } catch (error) {
      res.status(500).send({ message: error.message || "Some error occurred while retrieving accounts." });
    }
  };