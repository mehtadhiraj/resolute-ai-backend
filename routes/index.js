const express = require('express');

const staticRouter = require('./staticRoutes');
const usersRouter = require('./users');

const initRoutes = function(app){
  console.log("Initializing Routes...");

  app.use('/', staticRouter);
  app.use('/users', usersRouter);

  console.log("Routes Initialized.");
}

module.exports = initRoutes;
