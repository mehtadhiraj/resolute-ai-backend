const express = require('express');

const staticRouter = require('./staticRoutes');
const usersRouter = require('./users');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   // res.render('index', { title: 'Express' })
//   res.json({
//     message: "Hello"
//   })
// });

const initRoutes = function(app){
  console.log("Initializing Routes...");

  app.use('/', staticRouter);
  app.use('/users', usersRouter);

  console.log("Routes Initialized.");
}

module.exports = initRoutes;
