const db = require('../models');
const Account = db.Account;
const User = db.User;
const Bank = db.Bank;
const Op = db.Sequelize.Op;

exports.withdraw = async (req, res) => {

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

    console.log("balance = "+account.balance);

  try{

    const [updated] = await Account.update({balance: (account.balance-amount)}, { where: { account_id: id } });

    if (updated) {

        const formattedResponse = {
            account_id: account.account_id,
            user_id: account.user_id,
            user_name: account.User.name,
            bank_id: account.bank_id,
            bank_name: account.Bank.name,
            balance: (account.balance - amount),
          };

        res.send(formattedResponse);

    }else{
        res.status(201).send({ message: `Cannot update Account.` });
    }

  }catch (error) {
      res.status(201).send({ message: error.message || "Some error occurred while creating the Bank." });
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

    console.log("balance = "+account.balance);

  try{

    const [updated] = await Account.update({balance: (account.balance+amount)}, { where: { account_id: id } });

    if (updated) {

        const formattedResponse = {
            account_id: account.account_id,
            user_id: account.user_id,
            user_name: account.User.name,
            bank_id: account.bank_id,
            bank_name: account.Bank.name,
            balance: (account.balance + amount),
          };

        res.send(formattedResponse);

    }else{
        res.status(201).send({ message: `Cannot update Account.` });
    }

  }catch (error) {
      res.status(201).send({ message: error.message || "Some error occurred while creating the Bank." });
  }
  
  
  };