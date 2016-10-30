'use strict';

const baseUrl = 'https://localhost:5000';

const staticAsssets = [{
  mime: 'text/html',
  url: baseUrl
}, {
  mime: 'text/css',
  url: `${baseUrl}/assets/styles/app.min.css`
}, {
  mime: 'application/javascript',
  url: `${baseUrl}/assets/scripts/app.min.js`
}];

let request = require('request');

describe('gzip', () => {
  describe('when is enabled', () => {
    it('should not gzip image/png', cb => {
      request.get({
        url: `${baseUrl}/assets/images/express-security-logo.png`,
        gzip: true
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-encoding']).toBeUndefined();
        expect(response.headers['content-length']).toBeDefined();
        cb();
      });
    });

    staticAsssets.forEach(asset => {
      describe(`for the ${asset.mime}`, () => {
        let response;

        beforeEach(cb => {
          request.get({
            url: asset.url,
            gzip: true
          }, (error, assetResponse) => {
            if (error) {
              return cb(error);
            }

            response = assetResponse;
            cb();
          });
        });

        it('should have encoding in response headers', () => {
          expect(response.statusCode).toBe(200);
          expect(response.headers['content-encoding']).toBe('gzip');
        });

        if (asset.mime !== 'text/html') {
          it('should use weak etags', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers.etag).toMatch('^W/.+');
          });

          it('should have content length header', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-length']).toBeDefined();
          });
        }
      });
    });
  });
});
