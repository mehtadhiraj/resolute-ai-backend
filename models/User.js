'use strict';
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          isEmail: true
      }
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['Male', 'Female', 'Other']
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
          isDate: true
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    images: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.ENUM,
      values: ["admin", "user"],
      defaultValue: "user"
    }
  }, {
    hooks:{
      // encrypt password before storing in database
      beforeCreate: async function(user) {
          const salt = await bcrypt.genSalt(10); //whatever number you want
          user.password = await bcrypt.hash(user.password, salt);
      }
    },
    instanceMethods: {
      //Method to validate a password
      validPassword: function(password, storedPassword) {
        return bcrypt.compareSync(password, storedPassword); 
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};