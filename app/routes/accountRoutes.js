module.exports = app => {
    const accounts = require("../controllers/accountController.js");
    const router = require("express").Router();

    router.get("/", accounts.findAll);
    router.post("/",accounts.create);
  
    app.use("/api/account", router);
  };
  