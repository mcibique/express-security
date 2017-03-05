import request from 'request';

const BASE_URL = 'https://localhost:5000';

describe('return url', function () {
  describe('when redirecting to login', function () {
    it('should have returnUrl', function (cb) {
      request.get({
        url: `${BASE_URL}/user/?id=1`,
        followRedirect: false
      }, function onReponse(error, response) {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(303);
        expect(response.headers.location).toBe(`/login/?returnUrl=${encodeURIComponent('/user/?id=1')}`);
        cb();
      });
    });

    describe('and returnUrl is absolute URL', function () {
      it('should replace it with default returnUrl', function (cb) {
        const targetSite = 'http://whatever.com';
        request.get({
          url: `${BASE_URL}/login?returnUrl=${encodeURIComponent(targetSite)}`,
          followRedirect: false
        }, function onReponse(error, response) {
          if (error) {
            return cb(error);
          }
          expect(response.statusCode).toBe(302);
          expect(response.headers.location).toBe(`/login/?returnUrl=${encodeURIComponent('/')}`);
          cb();
        });
      });
    });
  });
});
