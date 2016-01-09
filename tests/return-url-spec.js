'use strict';

const baseUrl = 'https://localhost:5000';
let request = require('request');

describe('server', () => {
  it('should have returnUrl when redirecting to login', (cb) => {
    request.get({
      url: `${baseUrl}/user/?id=1`,
      followRedirect: false
    }, (error, response) => {
      expect(response.statusCode).toBe(303);
      expect(response.headers.location).toBe(`/login/?returnUrl=${encodeURIComponent('/user/?id=1')}`);
      cb();
    });
  });

  it('should not allow absolute URLs in returnUrl query', (cb) => {
    const targetSite = 'http://whatever.com';
    request.get({
      url: `${baseUrl}/login?returnUrl=${encodeURIComponent(targetSite)}`,
      followRedirect: false
    }, (error, response) => {
      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe(`/login/?returnUrl=${encodeURIComponent('/')}`);
      cb();
    });
  });
});
