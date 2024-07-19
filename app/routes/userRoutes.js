module.exports = app => {
    const users = require("../controllers/userController.js");
    const router = require("express").Router();

    router.post("/", users.create);
  
    app.use("/api/user", router);
  };