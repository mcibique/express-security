'use strict';

let request = require('request');

const baseUrl = 'https://localhost:5000';
const loginUrl = `${baseUrl}/login/`;

describe('csrf', () => {
  it('should return back to login when token is not present', (cb) => {
    request.post({
      url: loginUrl,
      form: {
        username: 'a',
        password: 'b'
      }
    }, (error, response) => {
      if (error) {
        return cb(error);
      }
      expect(response.statusCode).toBe(303);
      expect(response.headers.location).toBe('/login/');
      cb();
    });
  });

  it('should return back to login when token is wrong', (cb) => {
    request.post({
      url: loginUrl,
      form: {
        username: 'a',
        password: 'b',
        _csrf: 'random invalid token'
      }
    }, (error, response) => {
      if (error) {
        return cb(error);
      }
      expect(response.statusCode).toBe(303);
      expect(response.headers.location).toBe('/login/');
      cb();
    });
  });
});
