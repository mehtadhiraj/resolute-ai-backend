const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
require('dotenv').config();
const cors = require('cors');

const initMiddleware = function(app){
    console.log("Initializing Middleware...");
    app.use(cors());

    // view engine setup
    // app.set('views', path.join(__dirname, 'views'));
    // app.set('view engine', 'ejs');

    app.use(logger('dev'));
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({limit: '50mb', extended: true}));
    // app.use(bodyParser.urlencoded({ extended: true, parameterLimit:50000, limit: '50mb' }));
    // app.use(bodyParser.json({ limit: '50mb' }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));
    
    console.log("Middleware Initialized.");
}

module.exports = initMiddleware;