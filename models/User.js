const Sequelize = require('sequelize');
const bcrypt = require("bcrypt");

const Model = Sequelize.Model;

class User extends Model {};
User.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { 
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
        isEmail: true
    }
  },
  gender: {
    type: Sequelize.ENUM,
    values: ['Male', 'Female', 'Other']
  },
  dob: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    validate: {
        isDate: true
    }
  },
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  images: {
    type: Sequelize.STRING
  }
}, {
  Sequelize,
  modelName: 'user',
  timestamps: true,
  hooks:{
    beforeCreate: async function(user) {
        const salt = await bcrypt.genSalt(10); //whatever number you want
        user.password = await bcrypt.hash(user.password, salt);
    }
  },
  instanceMethods: {
    validPassword: function(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }    
  // options
});

module.exports = User;