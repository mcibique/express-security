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

  describe('cookie between two request', () => {
    let firstSessionCookie;
    let secondSessionCookie;

    beforeEach(cb => {
      const cookies = request.jar();
      request.get({
        url: baseUrl,
        jar: cookies,
        followRedirect: true
      }, firstError => {
        if (firstError) {
          return cb(firstError);
        }
        let firstResponseCookies = cookies.getCookies(baseUrl);
        firstSessionCookie = firstResponseCookies.filter(cookie => cookie.key === 'session')[0];

        // 2nd request
        request.get({
          url: baseUrl,
          jar: cookies,
          followRedirect: true
        }, secondError => {
          if (secondError) {
            return cb(secondError);
          }
          let secondResponseCookies = cookies.getCookies(baseUrl);
          secondSessionCookie = secondResponseCookies.filter(cookie => cookie.key === 'session')[0];

          cb();
        });
      });
    });

    it('should keep the same session cookie between two requests', () => {
      expect(firstSessionCookie).toBeDefined();
      expect(secondSessionCookie).toBeDefined();
      expect(firstSessionCookie.value).toBeDefined();
      expect(secondSessionCookie.value).toBeDefined();
      expect(firstSessionCookie.value).toBe(secondSessionCookie.value);
    });

    it('should keep renewing the session cookie between two requests', () => {
      expect(firstSessionCookie).toBeDefined();
      expect(secondSessionCookie).toBeDefined();
      expect(firstSessionCookie.expires).toBeDefined();
      expect(secondSessionCookie.expires).toBeDefined();
      expect(firstSessionCookie.expires).not.toBe(secondSessionCookie.expires);
    });
  });
});
