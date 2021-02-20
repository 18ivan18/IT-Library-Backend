const { Sequelize } = require("sequelize");
const { getBook } = require("./Models/Books/Book");
const { getTranaction } = require("./Models/Transactions/Transaction");
const { getUser } = require("./Models/Users/User");
require("dotenv").config();
let db = {};

module.exports.getDB = () => db;

module.exports.connect = () => {
  const { DB_USER, DB_DATABASE, DB_DIALECT, DB_PASS } = process.env;
  const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASS, {
    dialect: DB_DIALECT,
    dialectOptions: {
      // Observe the need for this nested `options` field for MSSQL
      options: {
        // Your tedious options here
        useUTC: false,
        dateFirst: 1,
        validateBulkLoadParameters: true,
      },
    },
  });

  return sequelize
    .authenticate()
    .then(() => {
      db.User = getUser(sequelize);
      db.Book = getBook(sequelize);
      db.Transaction = getTranaction(sequelize);
      db.Sequelize = Sequelize;
      db.sequelize = sequelize;
    })
    .then(() => {
      db.User.sync();
      db.Book.sync();
      db.Transaction.sync();
    })
    .then(() => {
      console.log(
        `Connection established successfully. Connected to database ${DB_DATABASE}.`
      );
      return Promise.resolve();
    })
    .catch((err) => console.error("Unable to connect to the database:", err));
};
