const express = require('express');

const staticRouter = require('./staticRoutes');

const initRoutes = function(app){
  console.log("Initializing Routes...");

  app.use('/', staticRouter);
  
  console.log("Routes Initialized.");
}

module.exports = initRoutes;
