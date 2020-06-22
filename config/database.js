const Sequelize = require('sequelize');
const Models = require('../models');

const initDatabase = function(){
//     // Option 1: Passing parameters separately
//     const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//         host: 'localhost',
//         dialect: 'mysql'
//     });
  
//     sequelize.authenticate()
//         .then(() => {
//             console.log('Connection has been established successfully.');
//         })
//         .catch(err => {
//             console.error('Unable to connect to the database:', err);
//         });
    Models.sequelize.sync({
        force: false,
        logging: console.log
    }).then(()=>{
        console.log("Database connected");
    }).catch((error)=>{
        console.log(error);
    })
}

module.exports = initDatabase;
