const db = require('../models');
const Account = db.Account;
const User = db.User;
const Bank = db.Bank;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {

  const {user_id, bank_id, balance} = req.body;

  try{
    const [user, bank] = await Promise.all([
      User.findOne({
        where: { user_id: user_id }
      }),
      Bank.findOne({
        where: { bank_id: bank_id }
      })
    ]);

    if (!user || !bank) {
      const errorMessage = {
        error_no : 201,
        message : "User or Bank not found"
      }
      res.addSpanData(errorMessage,'http.response.post.error');
      return res.status(201).send({ message: "User or Bank not found" });
    }


    const account = await Account.create({user_id,bank_id,balance});
    const formattedResponse = {
      account_id: account.account_id,
      user_id: account.user_id,
      bank_id: account.bank_id,
      balance: account.balance,
    };
    res.send(formattedResponse);
  }catch (error) {
      res.status(201).send({ message: error.message || "Some error occurred while creating the Bank." });
  }


};

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