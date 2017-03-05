import { isLocalUrl } from '../../server/helpers/url';

describe('url helper', function () {
  let externalUrls = [
    'http://whatever.com',
    'https://whatever.com',
    '//whatever.com',
    'mailto:mail@whatever.com',
    'http://whatever.com:8080',
    'https://whatever.com:443'
  ];

  let localUrls = [
    '/',
    '/login',
    '/user?id="1"'
  ];

  function testExternalUrl(url) {
    it(`should mark url ${url} as external.`, function () {
      expect(isLocalUrl(url)).toBe(false);
    });
  }

  function testLocalUrl(url) {
    it(`should mark url ${url} as local.`, function () {
      expect(isLocalUrl(url)).toBe(true);
    });
  }

  externalUrls.forEach(testExternalUrl);
  localUrls.forEach(testLocalUrl);
});
