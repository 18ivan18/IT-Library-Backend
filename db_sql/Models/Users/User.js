const { DataTypes } = require("sequelize");
require("dotenv").config();

module.exports.getUser = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        // allowNull defaults to true
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        isEmail: true,
        validate: {
          notEmpty: {
            args: true,
            msg: "Email required",
          },
          isEmail: {
            args: true,
            msg: "Valid email required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePicture: {
        type: DataTypes.STRING,
        defaultValue: process.env.DEFAULT_PROFILE_PICTURE,
        isUrl: true,
      },
      resources: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
      },
      pizza: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Users",
    }
  );

  return User;
};
