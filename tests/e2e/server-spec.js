'use strict';

const baseUrl = 'https://localhost:5000';
let request = require('request');

describe('server', () => {
  it('should serve /', cb => {
    request.get({
      url: baseUrl,
      followRedirect: false
    }, (error, response) => {
      if (error) {
        return cb(error);
      }
      expect(response.statusCode).not.toBeGreaterThan(400);
      cb();
    });
  });

  it('should serve favicon', cb => {
    request.get({
      url: `${baseUrl}/favicon.ico`,
      followRedirect: false
    }, (error, response) => {
      if (error) {
        return cb(error);
      }
      expect(response.statusCode).toBe(200);
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
});
