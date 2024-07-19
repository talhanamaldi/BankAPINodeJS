module.exports = app => {
    const banks = require("../controllers/bankController.js");
    const router = require("express").Router();

    router.post("/", banks.create);
  
    app.use("/api/bank", router);
  };