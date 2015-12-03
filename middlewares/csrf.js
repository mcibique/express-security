'use strict';

let csrf = require('csurf');

module.exports = csrf({
  cookie: false
});
