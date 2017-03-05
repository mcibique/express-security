'use strict';

function isLocalUrl(url) {
  if (!url) {
    return false;
  }
  if (url.indexOf(':') >= 0) {
    return false;
  }
  if (url.indexOf('//') >= 0) {
    return false;
  }
  return url.indexOf('/') === 0;
}

module.exports = {
  isLocalUrl
};
