'use strict';

let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let favicon = require('serve-favicon');

const isDev = require('./helpers/debug');
const app = express();
const publicFolder = path.join(__dirname, 'public');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// global variables
app.locals.moment = require('moment');
// favicon
app.use(favicon(path.join(publicFolder, 'favicon.ico')));
// logger
app.use(require('./middlewares/logger'));
// gzip, deflate compression
app.use(require('./middlewares/compression'));
// assets folder and caching
require('./middlewares/assets')(app, publicFolder);
// JSON body
app.use(bodyParser.json());
// application/x-www-form-urlencoded body
app.use(bodyParser.urlencoded({ extended: false }));
// caching
require('./middlewares/caching')(app);
// security - helmet
require('./middlewares/security')(app);
// cookies
app.use(require('./middlewares/cookies'));
// session
app.use(require('./middlewares/session'));
// authentication
app.use(require('./middlewares/auth'));
// CSRF
app.use(require('./middlewares/csrf'));
// request variables
app.use(require('./middlewares/locals'));
// routes
app.use('/', require('./routes'));
// catch CSRF and authorization errors
app.use(require('./middlewares/errors/403'));
// catch 404 and forward to error handler
app.use(require('./middlewares/errors/404'));
// error handlers
if (isDev) {
  app.use(require('./middlewares/errors/500-dev'));
} else {
  app.use(require('./middlewares/errors/500-prod'));
}

module.exports = app;
