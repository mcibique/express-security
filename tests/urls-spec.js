'use strict';

let urls = require('../helpers/url');

describe('URL helper tests', () => {

  const externalUrls = [
    'http://whatever.com',
    'https://whatever.com',
    '//whatever.com',
    'mailto:mail@whatever.com',
    'http://whatever.com:8080',
    'https://whatever.com:443',
  ];

  const localUrls = [
    '/',
    '/login',
    '/user?id="1"'
  ]

  function testExternalUrl(url) {
    it('Should mark url ' + url + ' as external.', () => {
      expect(urls.isLocalUrl(url)).toBe(false);
    });
  }

  function testLocalUrl(url) {
    it('Should mark url ' + url + ' as local.', () => {
      expect(urls.isLocalUrl(url)).toBe(true);
    });
  }

  externalUrls.forEach(testExternalUrl);
  localUrls.forEach(testLocalUrl);
});