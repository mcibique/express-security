'use strict';

let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// logger
app.use(logger('dev'));
// JSON body
app.use(bodyParser.json());
// application/x-www-form-urlencoded body
app.use(bodyParser.urlencoded({ extended: false }));
// public folder
app.use(express.static(path.join(__dirname, 'public')));
// security - helmet
require('./middlewares/security')(app);
// cookies
app.use(require('./middlewares/cookies'));
// authentication
app.use(require('./middlewares/auth'));
// session
app.use(require('./middlewares/session'));
// CSRF
app.use(require('./middlewares/csrf'));
// global letiables
app.locals.moment = require('moment');
// request letiables
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
