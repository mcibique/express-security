'use strict';

const baseUrl = 'https://localhost:5000';

const staticAsssets = [{
  mime: 'text/css',
  url: `${baseUrl}/assets/styles/app.min.css`,
  wrongUrl: `${baseUrl}/assets/styles/app1.min.css`
}, {
  mime: 'application/javascript',
  url: `${baseUrl}/assets/scripts/app.min.js`,
  wrongUrl: `${baseUrl}/assets/scripts/app1.min.js`
}, {
  mime: 'image/png',
  url: `${baseUrl}/assets/images/express-security-logo.png`,
  wrongUrl: `${baseUrl}/assets/images/express-security-logo-1.png`
}, {
  mime: 'favicon',
  url: `${baseUrl}/favicon.ico`
}];

let request = require('request');

describe('server', () => {
  describe('when serving views', () => {
    it('should serve /', cb => {
      request.get({
        url: baseUrl,
        followRedirect: false
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBeLessThan(400);
        cb();
      });
    });

    it('should redirect unauthorized requests to /login url', cb => {
      request.get({
        url: baseUrl,
        followRedirect: false
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(303);
        expect(response.headers.location).toBe(`/login/?returnUrl=${encodeURIComponent('/')}`);
        cb();
      });
    });

    it('should redirect unknown-url to /login url', cb => {
      request.get({
        url: `${baseUrl}/unknown-url`,
        followRedirect: false
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(303);
        expect(response.headers.location).toBe(`/login/?returnUrl=${encodeURIComponent('/unknown-url')}`);
        cb();
      });
    });
  });

  describe('when serving assets', () => {
    describe('and the file exists', () => {
      staticAsssets.forEach(asset => {
        it(`should serve ${asset.mime}`, cb => {
          request.get({
            url: asset.url
          }, (error, response) => {
            if (error) {
              return cb(error);
            }
            expect(response.statusCode).toBe(200);
            cb();
          });
        });
      });
    });

    describe('and the file doesn\'t exist', () => {
      staticAsssets.filter(asset => !!asset.wrongUrl).forEach(asset => {
        it(`should return 404 for ${asset.mime}`, cb => {
          request.get({
            url: asset.wrongUrl
          }, (error, response) => {
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
