'use strict';

let request = require('request');

const baseUrl = 'https://localhost:5000';
const loginUrl = `${baseUrl}/login/`;

describe('csrf', () => {
  describe('when token is not present', () => {
    it('should return back to login', cb => {
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
  });

  describe('when token is wrong', () => {
    it('should return back to login', cb => {
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
});
