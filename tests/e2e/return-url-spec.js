'use strict';

const baseUrl = 'https://localhost:5000';
let request = require('request');

describe('return url', () => {
  describe('when redirecting to login', () => {
    it('should have returnUrl', cb => {
      request.get({
        url: `${baseUrl}/user/?id=1`,
        followRedirect: false
      }, (error, response) => {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(303);
        expect(response.headers.location).toBe(`/login/?returnUrl=${encodeURIComponent('/user/?id=1')}`);
        cb();
      });
    });

    describe('and returnUrl is absolute URL', () => {
      it('should replace it with default returnUrl', cb => {
        const targetSite = 'http://whatever.com';
        request.get({
          url: `${baseUrl}/login?returnUrl=${encodeURIComponent(targetSite)}`,
          followRedirect: false
        }, (error, response) => {
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
