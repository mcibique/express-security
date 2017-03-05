import request from 'request';
const BASE_URL = 'https://localhost:5000';

describe('session', function () {
  it('should get session cookie with first request', function (cb) {
    let cookies = request.jar();
    request.get({
      url: BASE_URL,
      jar: cookies,
      followRedirect: true
    }, function onReponse(error, response) {
      if (error) {
        return cb(error);
      }
      expect(response.statusCode).toBe(200);

      let responseCookies = cookies.getCookies(BASE_URL);
      expect(responseCookies).toBeDefined();

      let filtered = responseCookies.find(cookie => cookie.key === 'session');
      expect(filtered).toBeDefined();

      cb();
    });
  });

  describe('cookie flags', function () {
    let sessionCookie;

    beforeEach(function (cb) {
      let cookies = request.jar();
      request.get({
        url: BASE_URL,
        jar: cookies,
        followRedirect: true
      }, function onReponse(error, response) {
        if (error) {
          return cb(error);
        }
        expect(response.statusCode).toBe(200);

        let responseCookies = cookies.getCookies(BASE_URL);
        sessionCookie = responseCookies.find(cookie => cookie.key === 'session');

        cb();
      });
    });

    it('should have turned Secure flag on', function () {
      expect(sessionCookie.secure).toBe(true);
    });

    it('should have turned HttpOnly flag on', function () {
      expect(sessionCookie.httpOnly).toBe(true);
    });

    it('should have turned HostOnly flag on', function () {
      expect(sessionCookie.hostOnly).toBe(true);
    });
  });

  describe('cookie between two request', function () {
    let firstSessionCookie;
    let secondSessionCookie;

    beforeEach(function (cb) {
      let cookies = request.jar();
      request.get({
        url: BASE_URL,
        jar: cookies,
        followRedirect: true
      }, firstError => {
        if (firstError) {
          return cb(firstError);
        }
        let firstResponseCookies = cookies.getCookies(BASE_URL);
        firstSessionCookie = firstResponseCookies.find(cookie => cookie.key === 'session');

        // 2nd request
        request.get({
          url: BASE_URL,
          jar: cookies,
          followRedirect: true
        }, secondError => {
          if (secondError) {
            return cb(secondError);
          }
          let secondResponseCookies = cookies.getCookies(BASE_URL);
          secondSessionCookie = secondResponseCookies.find(cookie => cookie.key === 'session');

          cb();
        });
      });
    });

    it('should keep the same session cookie between two requests', function () {
      expect(firstSessionCookie).toBeDefined();
      expect(secondSessionCookie).toBeDefined();
      expect(firstSessionCookie.value).toBeDefined();
      expect(secondSessionCookie.value).toBeDefined();
      expect(firstSessionCookie.value).toBe(secondSessionCookie.value);
    });

    it('should keep renewing the session cookie between two requests', function () {
      expect(firstSessionCookie).toBeDefined();
      expect(secondSessionCookie).toBeDefined();
      expect(firstSessionCookie.expires).toBeDefined();
      expect(secondSessionCookie.expires).toBeDefined();
      expect(firstSessionCookie.expires).not.toBe(secondSessionCookie.expires);
    });
  });
});
