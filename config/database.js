const Sequelize = require('sequelize');
const Models = require('../models');

const initDatabase = function(){
    console.log("Initializing Database Connection...");

    // Syncronizing all models storedin "../models" folder
    Models.sequelize.sync({
        force: false,   // false option help us create new table if does not exist. 
        logging: console.log
    }).then(()=>{
        console.log("Database Connected");
    }).catch((error)=>{
        console.log(error);
    })
}

module.exports = initDatabase;
