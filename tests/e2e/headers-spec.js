'use strict';

const baseUrl = 'https://localhost:5000';

const staticAsssets = [{
  mime: 'text/css',
  url: `${baseUrl}/assets/styles/app.min.css`,
  serverPath: 'public/styles/app.min.css'
}, {
  mime: 'application/javascript',
  url: `${baseUrl}/assets/scripts/app.min.js`,
  serverPath: 'public/scripts/app.min.js'
}, {
  mime: 'image/png',
  url: `${baseUrl}/assets/images/express-security-logo.png`,
  serverPath: 'public/images/express-security-logo.png'
}];

let request = require('request');
let fs = require('fs');

describe('headers', () => {
  describe('hsts', () => {
    it('should have "strict-transport-security" header set for text/html', cb => {
      request.get({
        url: baseUrl
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);
        let hsts = response.headers['strict-transport-security'];
        expect(hsts).toBeDefined();
        expect(hsts.includes('max-age=')).toBe(true);
        expect(hsts.includes('includeSubDomains')).toBe(true);
        expect(hsts.includes('preload')).toBe(true);
        cb();
      });
    });

    staticAsssets.forEach(asset => {
      it(`should not have "strict-transport-security" header set for ${asset.mime}`, cb => {
        request.get({
          url: asset.url
        }, (error, response) => {
          if (error) {
            return cb(error);
          }
          expect(response.statusCode).toBe(200);
          expect(response.headers['strict-transport-security']).not.toBeDefined();
          cb();
        });
      });
    });
  });

  describe('x-frame-options', () => {
    it('should have "x-frame-options" header set to deny for text/html', cb => {
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
      it(`should not have "x-frame-options" header set for ${asset.mime}`, cb => {
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
    it('should have "CSP" header set for text/html', cb => {
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
      it(`should not have "CSP" header set for ${asset.mime}`, cb => {
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
        let pinsValue = response.headers['public-key-pins'];
        expect(pinsValue).toBeDefined();
        expect(pinsValue.includes('pin-sha256=')).toBe(true);
        expect(pinsValue.includes('max-age=')).toBe(true);
        expect(pinsValue.includes('report-uri=')).toBe(true);
        expect(pinsValue.includes('includeSubDomains')).toBe(true);
        cb();
      });
    });

    staticAsssets.forEach(asset => {
      it(`should not have "Public-Key-Pins" header set for ${asset.mime}`, cb => {
        request.get({
          url: asset.url
        }, (error, response) => {
          if (error) {
            return cb(error);
          }
          expect(response.statusCode).toBe(200);
          expect(response.headers['public-key-pins']).not.toBeDefined();
          cb();
        });
      });
    });
  });

  describe('referrer-policy', () => {
    it('should have "referrer-policy" header set for text/html', cb => {
      request.get({
        url: baseUrl
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);
        expect(response.headers['referrer-policy']).toBe('no-referrer');
        cb();
      });
    });

    staticAsssets.forEach(asset => {
      it(`should not have "referrer-policy" header set for ${asset.mime}`, cb => {
        request.get({
          url: asset.url
        }, (error, response) => {
          if (error) {
            return cb(error);
          }
          expect(response.statusCode).toBe(200);
          expect(response.headers['referrer-policy']).not.toBeDefined();
          cb();
        });
      });
    });
  });
});
