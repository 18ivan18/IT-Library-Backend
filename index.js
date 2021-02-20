global.__basedir = __dirname;

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const api = require("./api");
const db = require("./db_sql");
const PORT = process.env.PORT_SERVER || 3000;
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

api.connect(app, "/api");

app.get("*", function (req, res) {
  res.status(404).send("PAGE NOT FOUND!");
});

app.use(function (err, req, res, next) {
  if (err.message === "BAD_REQUEST") {
    res.status(400).send("BAD REQUEST");
    return;
  }
  console.log(err);
  res.status(500).send("SERVER ERROR");
});

db.connect().then(() => {
  app.listen(PORT, function () {
    console.log(`Server is listening on: ${PORT}`);
  });
});
