const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const graphQLHTTP = require("express-graphql").graphqlHTTP;

const db = require("./config/db");

require("dotenv").config();

const schema = require("./schemas/index");

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use(
  "/api",
  graphQLHTTP({
    schema,
    graphiql: true,
  })
);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
