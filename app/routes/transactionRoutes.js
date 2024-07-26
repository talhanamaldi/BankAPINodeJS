module.exports = app => {
    const transactions = require("../controllers/transactionController.js");
    const router = require("express").Router();

    router.post("/", transactions.create);

    router.get("/", transactions.findAll);
  
    router.get("/:id", transactions.findOne);

    router.put("/:id", transactions.update);
  
    router.delete("/:id", transactions.delete);

    router.delete("/", transactions.deleteAll);

    //account ile transaction bulma
    router.get("/account/:id",transactions.findAccounts);

    router.put("/withdraw/:id", transactions.withdraw);
    router.put("/deposit/:id", transactions.deposit);
  
    app.use("/api/transaction", router);
  };
  