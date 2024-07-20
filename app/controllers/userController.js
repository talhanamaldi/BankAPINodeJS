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
        res.send(formattedResponse);
    }catch (error) {
        res.status(201).send({ message: error.message || "Some error occurred while creating the User." });
    }


};