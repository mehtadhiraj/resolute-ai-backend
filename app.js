const createError = require('http-errors');
const express = require('express');
const app = express();

const initDatabase = require('./config/database')();  //Database initialization
const initMiddleware = require('./config/middleware')(app); // Middleware initialization
const initRoutes = require('./routes/index')(app); // Routes initilaization



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err});
});

module.exports = app;
