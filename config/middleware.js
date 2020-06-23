const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
require('dotenv').config();
const cors = require('cors');

const initMiddleware = function(app){
    console.log("Initializing Middleware...");
    
    app.use(cors()); // initialize coors for cross origin request
    app.use(logger('dev'));
    // Limit set to 50mb to accept the learge size images from the client
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({limit: '50mb', extended: true}));
    
    app.use(cookieParser());
    //Set public forlder to static to get access of the images stored in it.
    app.use(express.static(path.join(__dirname, '../public')));
    
    console.log("Middleware Initialized.");
}

module.exports = initMiddleware;