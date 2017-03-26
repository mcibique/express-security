import { assetLocals, viewLocals } from 'middlewares/locals';
import assets from 'middlewares/assets';
import auth from 'middlewares/auth';
import bodyParser from 'body-parser';
import caching from 'middlewares/caching';
import compression from 'middlewares/compression';
import cookies from 'middlewares/cookies';
import csrf from 'middlewares/csrf';
import error403 from 'middlewares/errors/403';
import error404 from 'middlewares/errors/404';
import error500dev from 'middlewares/errors/500-dev';
import error500prod from 'middlewares/errors/500-prod';
import express from 'express';
import favicon from 'serve-favicon';
import { IS_DEBUG } from 'config';
import logger from 'middlewares/logger';
import moment from 'moment';
import path from 'path';
import rateLimits from 'middlewares/limits';
import refererAndOrigin from 'middlewares/referer-origin';
import routes from 'routes';
import security from 'middlewares/security';
import session from 'middlewares/session';

const PUBLIC_FOLDER = path.join(__dirname, 'public');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// global variables
app.locals.moment = moment;
// favicon
app.use(favicon(path.join(PUBLIC_FOLDER, 'favicon.ico')));
// logger
app.use(logger);
// gzip, brotli compression; pre-compressed-assets
compression(app, PUBLIC_FOLDER);
// assets folder and caching
assets(app, PUBLIC_FOLDER);
// assets locals
app.use(assetLocals);
// JSON body
app.use(bodyParser.json());
// application/x-www-form-urlencoded body
app.use(bodyParser.urlencoded({ extended: false }));
// caching
caching(app);
// security - helmet
security(app);
// rate limits
rateLimits(app);
// cookies
app.use(cookies);
// session
app.use(session);
// authentication
app.use(auth);
// referer and origin validation
app.use(refererAndOrigin);
// CSRF
app.use(csrf);
// request variables
app.use(viewLocals);
// routes
app.use('/', routes);
// catch CSRF and authorization errors
app.use(error403);
// catch 404 and forward to error handler
app.use(error404);
// error handlers
if (IS_DEBUG) {
  app.use(error500dev);
} else {
  app.use(error500prod);
}

export default app;
