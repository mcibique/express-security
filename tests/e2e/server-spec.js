import request from 'request';

const BASE_URL = 'https://localhost:5000';

let staticAsssets = [{
  mime: 'text/css',
  url: `${BASE_URL}/assets/styles/app.min.css`,
  wrongUrl: `${BASE_URL}/assets/styles/app1.min.css`
}, {
  mime: 'application/javascript',
  url: `${BASE_URL}/assets/scripts/app.min.js`,
  wrongUrl: `${BASE_URL}/assets/scripts/app1.min.js`
}, {
  mime: 'image/png',
  url: `${BASE_URL}/assets/images/express-security-logo.png`,
  wrongUrl: `${BASE_URL}/assets/images/express-security-logo-1.png`
}, {
  mime: 'favicon',
  url: `${BASE_URL}/favicon.ico`
}];

describe('server', function () {
  describe('when serving views', function () {
    it('should serve /', function (cb) {
      request.get({
        url: BASE_URL,
        followRedirect: false
      }, function onReponse(error, response) {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBeLessThan(400);
        cb();
      });
    });

    it('should redirect unauthorized requests to /login url', function (cb) {
      request.get({
        url: BASE_URL,
        followRedirect: false
      }, function onReponse(error, response) {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(303);
        expect(response.headers.location).toBe(`/login/?returnUrl=${encodeURIComponent('/')}`);
        cb();
      });
    });

    it('should redirect unknown-url to /login url', function (cb) {
      request.get({
        url: `${BASE_URL}/unknown-url`,
        followRedirect: false
      }, function onReponse(error, response) {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(303);
        expect(response.headers.location).toBe(`/login/?returnUrl=${encodeURIComponent('/unknown-url')}`);
        cb();
      });
    });
  });

  describe('when serving assets', function () {
    describe('and the file exists', function () {
      staticAsssets.forEach(function (asset) {
        it(`should serve ${asset.mime}`, function (cb) {
          request.get({
            url: asset.url
          }, function onReponse(error, response) {
            if (error) {
              return cb(error);
            }
            expect(response.statusCode).toBe(200);
            cb();
          });
        });
      });
    });

    describe('and the file doesn\'t exist', function () {
      staticAsssets.filter(asset => !!asset.wrongUrl).forEach(function (asset) {
        it(`should return 404 for ${asset.mime}`, function (cb) {
          request.get({
            url: asset.wrongUrl
          }, function onReponse(error, response) {
            if (error) {
              return cb(error);
            }
            expect(response.statusCode).toBe(404);
            cb();
          });
        });
      });
    });
  });
});
