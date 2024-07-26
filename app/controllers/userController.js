const db = require('../models');
const User = db.User;

const Op = db.Sequelize.Op;

exports.create = async (req, res) => {

    const { name} = req.body;

    try{
        const user = await User.create({name});
        const formattedResponse = {
            user_id: user.user_id,
            user_name: user.name
          };
        res.addSpanData(formattedResponse,"http.response.body")
        res.send(formattedResponse);
    }catch (error) {
        res.status(400).send({ message: error.message || "Some error occurred while creating the User." });
    }
};




exports.findOne = async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await User.findByPk(id);
  if (!user) {
    const errorMessage = {
      error_no : 201,
      message : `User with id=${id} not found.` 
    }
    res.addSpanData(errorMessage,'http.response.error');
    return res.status(201).send({ message: `User with id=${id} not found.` });
  }
  
  const formattedResponse = {
    user_name: user.name
  };
  
  res.send(formattedResponse);
  
    } catch (error) {
      res.status(400).send({ message: error.message || `Error retrieving User with id=${id}` });
    }
  };