const { DataTypes } = require("sequelize");
require("dotenv").config();

module.exports.getBook = (sequelize) => {
  const Book = sequelize.define(
    "Book",
    {
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      coverURL: {
        type: DataTypes.STRING,
        allowNull: false,
        isURL: true,
      },
      pdfURL: {
        type: DataTypes.STRING,
        allowNull: false,
        isURL: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        max: 1024,
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      type: {
        type: DataTypes.STRING,
        isIn: [["book", "magazine", "paper"]],
        defaultValue: "book",
      },
      physical: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
        is: /^#/,
      },
    },
    {
      tableName: "Books",
    }
  );

  return Book;
};
