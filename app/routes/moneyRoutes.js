module.exports = app => {
    const money = require("../controllers/moneyController.js");
    const router = require("express").Router();

    router.put("/withdraw/:id", money.withdraw);
    router.put("/deposit/:id", money.deposit);

    app.use("/api/money", router);
  };