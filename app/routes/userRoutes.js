module.exports = app => {
    const users = require("../controllers/userController.js");
    const router = require("express").Router();

    router.post("/", users.create);

    router.get("/:id", users.findOne);
  
    app.use("/api/user", router);
  };