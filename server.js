const express = require("express");

const {swaggerUI, swaggerSpec} = require("./app/config/swaggerConfig");

const app = express();

const { context, trace } = require ("@opentelemetry/api");

const addSpanAttribute = require("./app/spans/span");


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(addSpanAttribute); 


/*app.use((req, res, next) => {
  const currentSpan = trace.getSpan(context.active());
  if (currentSpan && req.method === "POST") {
    currentSpan.setAttribute('http.request.body', JSON.stringify(req.body));
    
  }
  next();
});*/



const db = require("./app/models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    //require("./seed");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to NodeJSAPI" });
});

require("./app/routes/transactionRoutes")(app);
require("./app/routes/accountRoutes")(app);
require("./app/routes/userRoutes")(app);
require("./app/routes/bankRoutes")(app);


const PORT = process.env.PORT || 8042;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
