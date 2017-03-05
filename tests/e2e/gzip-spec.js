import request from 'request';

const BASE_URL = 'https://localhost:5000';

let staticAsssets = [{
  mime: 'text/html',
  url: BASE_URL
}, {
  mime: 'text/css',
  url: `${BASE_URL}/assets/styles/app.min.css`
}, {
  mime: 'application/javascript',
  url: `${BASE_URL}/assets/scripts/app.min.js`
}];

describe('gzip', function () {
  describe('when is enabled', function () {
    it('should not gzip image/png', function (cb) {
      request.get({
        url: `${BASE_URL}/assets/images/express-security-logo.png`,
        gzip: true
      }, function onReponse(error, response) {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-encoding']).toBeUndefined();
        expect(response.headers['content-length']).toBeDefined();
        cb();
      });
    });

    staticAsssets.forEach(function (asset) {
      describe(`for the ${asset.mime}`, function () {
        let response;

        beforeEach(function (cb) {
          request.get({
            url: asset.url,
            gzip: true
          }, function onReponse(error, assetResponse) {
            if (error) {
              return cb(error);
            }

            response = assetResponse;
            cb();
          });
        });

        it('should have encoding in response headers', function () {
          expect(response.statusCode).toBe(200);
          expect(response.headers['content-encoding']).toBe('gzip');
        });

        if (asset.mime !== 'text/html') {
          it('should use weak etags', function () {
            expect(response.statusCode).toBe(200);
            expect(response.headers.etag).toMatch('^W/.+');
          });

          it('should have content length header', function () {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-length']).toBeDefined();
          });
        }
      });
    });
  });
});
