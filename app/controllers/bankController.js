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
        res.addSpanData(formattedResponse,"http.response.body")
        res.send(formattedResponse);
    }catch (error) {
        res.status(400).send({ message: error.message || "Some error occurred while creating the Bank." });
    }


};





exports.findOne = async (req, res) => {
    const id = req.params.id;
  
    try {
      const bank = await Bank.findByPk(id);
  if (!bank) {
    const errorMessage = {
      error_no : 201,
      message : `Bank with id=${id} not found.` 
    }
    res.addSpanData(errorMessage,'http.response.error');
    return res.status(201).send({ message: `Bank with id=${id} not found.` });
  }
  
  const formattedResponse = {
    bank_name: bank.name
  };
  
  res.send(formattedResponse);
  
    } catch (error) {
      res.status(400).send({ message: error.message || `Error retrieving Bank with id=${id}` });
    }
  };