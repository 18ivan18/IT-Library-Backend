const { DataTypes } = require("sequelize");
require("dotenv").config();

module.exports.getTranaction = (sequelize) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // 'Movies' would also work
          key: "id",
        },
      },
      BookId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Books", // 'Actors' would also work
          key: "id",
        },
      },
      returned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Transactions",
    }
  );

  return Transaction;
};
