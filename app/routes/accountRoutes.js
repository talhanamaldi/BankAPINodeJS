module.exports = app => {
    const accounts = require("../controllers/accountController.js");
    const router = require("express").Router();

    router.get("/", accounts.findAll);
    router.post("/",accounts.create);

    router.get("/:id", accounts.findOne);
  
    app.use("/api/account", router);
  };
  