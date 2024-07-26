module.exports = app => {
    const banks = require("../controllers/bankController.js");
    const router = require("express").Router();

    router.post("/", banks.create);

    router.get("/:id", banks.findOne);
  
    app.use("/api/bank", router);
  };