'use strict';

const baseUrl = 'https://localhost:5000';

const staticAsssets = [{
  mime: 'text/html',
  url: baseUrl
}, {
  mime: 'text/css',
  url: `${baseUrl}/styles/app.min.css`
}, {
  mime: 'application/javascript',
  url: `${baseUrl}/scripts/app.min.js`
}];

let request = require('request');

describe('gzip', () => {
  staticAsssets.forEach(asset => {
    describe(`when gzip is enabled for the ${asset.mime}`, () => {
      it('should have gzip in response headers', cb => {
        request.get({
          url: asset.url,
          gzip: true
        }, (error, response) => {
          if (error) {
            return cb(error);
          }
          expect(response.statusCode).toBe(200);
          expect(response.headers['content-encoding']).toBe('gzip');
          cb();
        });
      });

      if (asset.mime !== 'text/html') {
        it('should use weak etags', cb => {
          request.get({
            url: asset.url,
            gzip: true
          }, (error, response) => {
            if (error) {
              return cb(error);
            }
            expect(response.statusCode).toBe(200);
            expect(response.headers.etag).toMatch('^W/.+');
            cb();
          });
        });
      }
    });
  });

  describe('when gzip is enabled', () => {
    it('should not gzip image/png', cb => {
      request.get({
        url: `${baseUrl}/images/express-security-logo.png`,
        gzip: true
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-encoding']).toBeUndefined();
        cb();
      });
    });
  });
});
