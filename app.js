'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var helmet = require('helmet');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet.frameguard());
app.use(helmet.xssFilter());
app.use(helmet.hsts({
  maxAge: 10886400000,
  includeSubdomains: true
}))
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.noCache());
app.use(helmet.csp({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  baseUri: ["'self'"],
  frameAncestors: ["'none'"]
}));
// public folder
app.use(express.static(path.join(__dirname, 'public')));
// cookies
app.use(require('./middlewares/cookies'));
// authentication
app.use(require('./middlewares/auth'));
// session
app.use(require('./middlewares/session'));
// CSRF
app.use(require('./middlewares/csrf'));
// global variables
app.locals.moment = require('moment');
// request variables
app.use(require('./middlewares/locals'));
// routes
app.use('/', require('./routes'));
// catch 404 and forward to error handler
app.use(require('./middlewares/errors/404'));
// error handlers
if (app.get('env') === 'development') {
  app.use(require('./middlewares/errors/500-dev'));
} else {
  app.use(require('./middlewares/errors/500-prod'));
}

module.exports = app;
