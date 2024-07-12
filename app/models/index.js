const dbConfig = require("../config/dbConfig.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  define: {
    timestamps: false,
  },

});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.js")(sequelize, Sequelize);
db.Bank = require("./bank.js")(sequelize, Sequelize);
db.Account = require("./account.js")(sequelize, Sequelize);
db.Transaction = require("./transaction.js")(sequelize, Sequelize);

db.User.associate(db);
db.Bank.associate(db);
db.Account.associate(db);
db.Transaction.associate(db);

module.exports = db;
