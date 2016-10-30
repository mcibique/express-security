'use strict';

const baseUrl = 'https://localhost:5000';
let request = require('request');

describe('session', () => {
  it('should get session cookie with first request', cb => {
    let cookies = request.jar();
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

      let filtered = responseCookies.find(cookie => cookie.key === 'session');
      expect(filtered).toBeDefined();

      cb();
    });
  });

  describe('cookie flags', () => {
    let sessionCookie;

    beforeEach(cb => {
      let cookies = request.jar();
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
        sessionCookie = responseCookies.find(cookie => cookie.key === 'session');

        cb();
      });
    });

    it('should have turned Secure flag on', () => {
      expect(sessionCookie.secure).toBe(true);
    });

    it('should have turned HttpOnly flag on', () => {
      expect(sessionCookie.httpOnly).toBe(true);
    });

    it('should have turned HostOnly flag on', () => {
      expect(sessionCookie.hostOnly).toBe(true);
    });
  });

  describe('cookie between two request', () => {
    let firstSessionCookie;
    let secondSessionCookie;

    beforeEach(cb => {
      let cookies = request.jar();
      request.get({
        url: baseUrl,
        jar: cookies,
        followRedirect: true
      }, firstError => {
        if (firstError) {
          return cb(firstError);
        }
        let firstResponseCookies = cookies.getCookies(baseUrl);
        firstSessionCookie = firstResponseCookies.find(cookie => cookie.key === 'session');

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
          secondSessionCookie = secondResponseCookies.find(cookie => cookie.key === 'session');

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
