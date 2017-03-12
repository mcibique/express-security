import cookieParser from 'set-cookie-parser';
import { expect } from 'chai';

describe('session', function () {
  let sessionCookie;

  beforeEach(function () {
    return this.server.get('/')
      .redirects(1)
      .expect(function (response) {
        let cookies = cookieParser.parse(response);
        sessionCookie = cookies.find(cookie => cookie.name === 'session');
      });
  });

  it('should get session cookie with first request', function () {
    expect(sessionCookie).to.be.ok;
  });

  describe('cookie flags', function () {
    it('should have expires date set', function () {
      expect(sessionCookie.expires).to.be.ok;
    });

    it('should have turned Secure flag on', function () {
      expect(sessionCookie.secure).to.be.true;
    });

    it('should have turned HttpOnly flag on', function () {
      expect(sessionCookie.httpOnly).to.be.true;
    });

    it('should have turned SameSite flag on', function () {
      expect(sessionCookie.samesite).to.be.equal('Strict');
    });
  });

  describe('and another request is send', function () {
    let anotherSessionCookie;

    beforeEach(function () {
      return this.server.get('/')
        .redirects(1)
        .expect(function (response) {
          let cookies = cookieParser.parse(response);
          anotherSessionCookie = cookies.find(cookie => cookie.name === 'session');
        });
    });

    it('should keep the same session cookie between two requests', function () {
      expect(sessionCookie.value).to.be.equal(anotherSessionCookie.value);
    });

    it('should keep renewing the session cookie between two requests', function () {
      expect(sessionCookie.expires).not.to.be.equal(anotherSessionCookie.expires);
    });
  });
});
