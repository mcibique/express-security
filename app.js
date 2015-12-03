var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var session = require('express-session');
var csrf = require('csurf');

var routes = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var user = require('./routes/user');

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
app.use(cookieParser('notagoodsecret'));
app.use(session({
  name: 'session',
  resave: false,
  rolling: true,
  saveUninitialized: true,
  secret: "notagoodsecret",
  cookie: { httpOnly: true, secure: true, maxAge: 3600000 }
}));
app.use(helmet.csp({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  baseUri: ["'self'"],
  frameAncestors: ["'none'"]
}));
app.use(csrf());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function (req, res, next) {
  if (req.originalUrl.indexOf('/login') === 0) {
    next();
  } else {
    if (!req.signedCookies.auth) {
      res.redirect(303, '/login');
    } else {
      res.locals.username = req.signedCookies.auth;
      next();
    }
  }
});

app.use(function (req, res, next) {
  if (req.session) {
    res.locals.lastSignedIn = req.session.lastSignedIn;
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

app.locals.moment = require('moment');

app.use('/', routes);
app.use('/login', login);
app.use('/logout', logout);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
