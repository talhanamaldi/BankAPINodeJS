const db = require('../models');
const Bank = db.Bank;

const Op = db.Sequelize.Op;

exports.create = async (req, res) => {

    const {name} = req.body;

    try{
        const bank = await Bank.create({name});
        const formattedResponse = {
            bank_id: bank.bank_id,
            bank_name: bank.name,
          };
          
        res.send(formattedResponse);
    }catch (error) {
        res.status(201).send({ message: error.message || "Some error occurred while creating the Bank." });
    }


};