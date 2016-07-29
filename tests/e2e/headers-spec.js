'use strict';

const baseUrl = 'https://localhost:5000';

const staticAsssets = [{
  mime: 'text/css',
  url: `${baseUrl}/styles/app.min.css`,
  serverPath: 'public/styles/app.min.css'
}, {
  mime: 'application/javascript',
  url: `${baseUrl}/scripts/app.min.js`,
  serverPath: 'public/scripts/app.min.js'
}, {
  mime: 'image/png',
  url: `${baseUrl}/images/express-security-logo.png`,
  serverPath: 'public/images/express-security-logo.png'
}];

let request = require('request');
let fs = require('fs');

describe('headers', () => {
  describe('x-frame-options', () => {
    it('should have x-frame-options set to deny for text/html', cb => {
      request.get({
        url: baseUrl
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);
        expect(response.headers['x-frame-options']).toBe('DENY');
        cb();
      });
    });

    staticAsssets.forEach(asset => {
      it(`should not have x-frame-options set for ${asset.mime}`, cb => {
        request.get({
          url: asset.url
        }, (error, response) => {
          if (error) {
            return cb(error);
          }
          expect(response.statusCode).toBe(200);
          expect(response.headers['x-frame-options']).not.toBeDefined();
          cb();
        });
      });
    });
  });

  describe('csp', () => {
    it('should have CSP set for text/html', cb => {
      request.get({
        url: baseUrl
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-security-policy']).toMatch('default-src \'self\'; script-src \'self\' ' +
          '\'nonce-[a-f0-9-]{36}\'; style-src \'self\' \'nonce-[a-f0-9-]{36}\'; base-uri \'self\'; connect-src ' +
          '\'self\' wss:; frame-ancestors \'none\'; report-uri https://report-uri.io/report/expresssecuritytest');
        cb();
      });
    });

    staticAsssets.forEach(asset => {
      it(`should not have CSP set for ${asset.mime}`, cb => {
        request.get({
          url: asset.url
        }, (error, response) => {
          if (error) {
            return cb(error);
          }
          expect(response.statusCode).toBe(200);
          expect(response.headers['content-security-policy']).not.toBeDefined();
          cb();
        });
      });
    });
  });

  describe('dns prefetching', () => {
    it('should have DNS prefetching turned off for text/html', cb => {
      request.get({
        url: baseUrl
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);
        expect(response.headers['x-dns-prefetch-control']).toBe('off');
        cb();
      });
    });
  });

  describe('caching', () => {
    it('should have turned cache off for text/html', cb => {
      request.get({
        url: baseUrl
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);
        expect(response.headers['cache-control']).toBe('no-store, no-cache, must-revalidate, proxy-revalidate');
        expect(response.headers['surrogate-control']).toBe('no-store');
        expect(response.headers.pragma).toBe('no-cache');
        expect(response.headers.etag).not.toBeDefined();
        expect(response.headers['last-modified']).not.toBeDefined();
        cb();
      });
    });

    staticAsssets.forEach(asset => {
      it(`should have turned cache on for ${asset.mime}`, cb => {
        request.get({
          url: asset.url
        }, (error, response) => {
          if (error) {
            return cb(error);
          }
          expect(response.statusCode).toBe(200);
          expect(response.headers['cache-control']).toBe('public, max-age=31536000');
          expect(response.headers['surrogate-control']).not.toBeDefined();
          expect(response.headers.pragma).not.toBeDefined();
          cb();
        });
      });
    });

    describe('last-modified', () => {
      staticAsssets.forEach(asset => {
        it(`should have "Last-Modified" header set for ${asset.mime}`, cb => {
          request.get({
            url: asset.url
          }, (error, response) => {
            if (error) {
              return cb(error);
            }
            expect(response.statusCode).toBe(200);
            let lastModifiedDate = new Date(fs.statSync(asset.serverPath).mtime).toGMTString();
            expect(response.headers['last-modified']).toBe(lastModifiedDate);
            cb();
          });
        });
      });
    });

    describe('etag', () => {
      staticAsssets.forEach(asset => {
        it(`should have "ETag" header set for ${asset.mime}`, cb => {
          request.get({
            url: asset.url
          }, (error, response) => {
            if (error) {
              return cb(error);
            }
            expect(response.statusCode).toBe(200);
            expect(response.headers.etag).toBeDefined();
            cb();
          });
        });
      });
    });
  });

  describe('public-key-pins', () => {
    it('should have "Public-Key-Pins" header for text/html', cb => {
      request.get({
        url: baseUrl
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);
        const pinsValue = response.headers['public-key-pins'];
        expect(pinsValue).toBeDefined();
        let containsPins = pinsValue.indexOf('pin-sha256=') >= 0;
        expect(containsPins).toBe(true);
        let containsMaxAge = pinsValue.indexOf('max-age=') >= 0;
        expect(containsMaxAge).toBe(true);
        let containsReportUri = pinsValue.indexOf('report-uri=') >= 0;
        expect(containsReportUri).toBe(true);
        cb();
      });
    });
  });
});
