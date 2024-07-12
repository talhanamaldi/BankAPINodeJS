module.exports = app => {
    const transactions = require("../controllers/transactionController.js");
    const router = require("express").Router();

    router.post("/", transactions.create);

    router.get("/", transactions.findAll);
  
    router.get("/:id", transactions.findOne);

    router.put("/:id", transactions.update);
  
    router.delete("/:id", transactions.delete);

    router.delete("/", transactions.deleteAll);
  
    app.use("/api/transaction", router);
  };
  