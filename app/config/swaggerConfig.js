const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'NodeJS API',
        version: '1.0.0',
        description: 'NodeJSAPI',
      },
      servers:[
        {
          url: "http://10.150.238.165:8042/"
        }
      ]

    },
  
    apis: ["./app/routes/*.js"], 
};


const swaggerSpec = swaggerJSDoc(options);
module.exports = {swaggerUI, swaggerSpec};