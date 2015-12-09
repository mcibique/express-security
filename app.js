'use strict';

let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let ms = require('ms');

const isDev = require('./helpers/debug');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// logger
app.use(require('./middlewares/logger'));
// assets folder and caching
app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  etag: true,
  lastModified: true,
  maxAge: ms('365 days'),
  redirect: false,
  dotfiles: 'ignore'
}));
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
if (isDev) {
  app.use(require('./middlewares/errors/500-dev'));
} else {
  app.use(require('./middlewares/errors/500-prod'));
}

module.exports = app;
