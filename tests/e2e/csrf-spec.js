import request from 'request';

const BASE_URL = 'https://localhost:5000';
const LOGIN_URL = `${BASE_URL}/login/`;

describe('csrf', function () {
  describe('when token is not present', function () {
    it('should return back to login', function (cb) {
      request.post({
        url: LOGIN_URL,
        form: {
          username: 'a',
          password: 'b'
        }
      }, function onReponse(error, response) {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(303);
        expect(response.headers.location).toBe('/login/');
        cb();
      });
    });
  });

  describe('when token is wrong', function () {
    it('should return back to login', function (cb) {
      request.post({
        url: LOGIN_URL,
        form: {
          username: 'a',
          password: 'b',
          _csrf: 'random invalid token'
        }
      }, function onReponse(error, response) {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(303);
        expect(response.headers.location).toBe('/login/');
        cb();
      });
    });
  });
});
