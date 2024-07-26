const db = require('../models');
const Account = db.Account;
const User = db.User;
const Bank = db.Bank;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {

  const {user_id, bank_id, balance} = req.body;

  res.addSpanData(req.body,'http.request.body')

  try{
    const [user, bank] = await Promise.all([
      User.findOne({
        where: { user_id: user_id }
      }),
      Bank.findOne({
        where: { bank_id: bank_id }
      })
    ]);

    if (!user && !bank) {
      const errorMessage = {
        error_no : 201,
        error_description : `User with id=${user_id} and Bank with id=${bank_id} not found while creating Account`,   
        error_info : {}
      }
      res.addSpanData(errorMessage,'http.response.error');
      return res.status(201).send({ message: `User with id=${user_id} and Bank with id=${bank_id} not found while creating Account`});
    }else if(!user){
      const errorMessage = {
        error_no : 201,
        error_description : `User with id=${user_id} not found while creating Account`,  
        error_info : {}
      }
      res.addSpanData(errorMessage,'http.response.error');
      return res.status(201).send({ message: `User with id=${user_id} not found while creating Account` });

    }else if(!bank){
      const errorMessage = {
        error_no : 201,
        error_description : `Bank with id=${bank_id} not found while creating Account`,  
        error_info : {}
      }
      res.addSpanData(errorMessage,'http.response.error');
      return res.status(201).send({ message: `Bank with id=${bank_id} not found while creating Account` });

    }


    const account = await Account.create({user_id,bank_id,balance});
    const formattedResponse = {
      account_id: account.account_id,
      user_id: account.user_id,
      bank_id: account.bank_id,
      balance: account.balance,
    };
    res.addSpanData(formattedResponse,"http.response.post")
    res.send(formattedResponse);
  }catch (error) {
      res.status(400).send({ message: error.message || "Some error occurred while creating the Account." });
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
    res.status(400).send({ message: error.message || "Some error occurred while retrieving accounts." });
  }
};


exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const account = await Account.findByPk(id,{
      include: [
          {model: User,as: 'User'},
          {model: Bank,as: 'Bank'}
        ]
  });
if (!account) {
  const errorMessage = {
    error_no : 201,
    message : `Account with id=${id} not found.` 
  }
  res.addSpanData(errorMessage,'http.response.error');
  return res.status(201).send({ message: `Account with id=${id} not found.` });
}

const formattedResponse = {
  user_name: account.User.name,
  bank_name: account.Bank.name,
  balance: account.balance
};

res.send(formattedResponse);

  } catch (error) {
    res.status(400).send({ message: error.message || `Error retrieving Account with id=${id}` });
  }
};



