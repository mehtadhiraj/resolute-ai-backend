const Sequelize = require('sequelize');

const initDatabase = function(){
    // Option 1: Passing parameters separately
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    });
  
    sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}

module.exports = initDatabase;
