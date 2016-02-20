'use strict';

const baseUrl = 'https://localhost:5000';
let request = require('request');

describe('session', () => {
  it('should get session cookie with first request', cb => {
    const cookies = request.jar();
    request.get({
      url: baseUrl,
      jar: cookies,
      followRedirect: true
    }, (error, response) => {
      if (error) {
        return cb(error);
      }
      expect(response.statusCode).toBe(200);

      let responseCookies = cookies.getCookies(baseUrl);
      expect(responseCookies).toBeDefined();

      let filtered = responseCookies.filter(cookie => cookie.key === 'session');
      expect(filtered.length).toBe(1);
      expect(filtered[0].value).toBeDefined();

      cb();
    });
  });

  it('should have turned the secure and httpOnly flags on', cb => {
    const cookies = request.jar();
    request.get({
      url: baseUrl,
      jar: cookies,
      followRedirect: true
    }, (error, response) => {
      if (error) {
        return cb(error);
      }
      expect(response.statusCode).toBe(200);

      let responseCookies = cookies.getCookies(baseUrl);
      let sessionCookie = responseCookies.filter(cookie => cookie.key === 'session')[0];
      expect(sessionCookie.httpOnly).toBe(true);
      expect(sessionCookie.secure).toBe(true);

      cb();
    });
  });

  it('should keep the same session cookie between two requests', cb => {
    const cookies = request.jar();
    request.get({
      url: baseUrl,
      jar: cookies,
      followRedirect: true
    }, (firstError, firstResponse) => {
      if (firstError) {
        return cb(firstError);
      }
      expect(firstResponse.statusCode).toBe(200);

      let firstResponseCookies = cookies.getCookies(baseUrl);
      let firstSessionCookie = firstResponseCookies.filter(cookie => cookie.key === 'session')[0];
      expect(firstSessionCookie).toBeDefined();

      // 2nd request
      request.get({
        url: baseUrl,
        jar: cookies,
        followRedirect: true
      }, (secondError, secondResponse) => {
        if (secondError) {
          return cb(secondError);
        }
        expect(secondResponse.statusCode).toBe(200);

        let secondResponseCookies = cookies.getCookies(baseUrl);
        let secondSessionCookie = secondResponseCookies.filter(cookie => cookie.key === 'session')[0];
        expect(secondSessionCookie).toBeDefined();
        expect(firstSessionCookie.value).toBe(secondSessionCookie.value);

        cb();
      });
    });
  });

  it('should keep renew session cookie between two requests', cb => {
    const cookies = request.jar();
    request.get({
      url: baseUrl,
      jar: cookies,
      followRedirect: true
    }, (firstError, firstResponse) => {
      if (firstError) {
        return cb(firstError);
      }
      expect(firstResponse.statusCode).toBe(200);

      let firstResponseCookies = cookies.getCookies(baseUrl);
      let firstSessionCookie = firstResponseCookies.filter(cookie => cookie.key === 'session')[0];
      expect(firstSessionCookie).toBeDefined();

      // 2nd request
      request.get({
        url: baseUrl,
        jar: cookies,
        followRedirect: true
      }, (secondError, secondResponse) => {
        if (secondError) {
          return cb(secondError);
        }
        expect(secondResponse.statusCode).toBe(200);

        let secondResponseCookies = cookies.getCookies(baseUrl);
        let secondSessionCookie = secondResponseCookies.filter(cookie => cookie.key === 'session')[0];
        expect(secondSessionCookie).toBeDefined();
        expect(firstSessionCookie.expires).not.toBe(secondSessionCookie.expires);

        cb();
      });
    });
  });
});
