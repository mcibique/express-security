var hpkp = require('..');

var connect = require('connect');
var request = require('supertest');
var assert = require('assert');

describe('hpkp', function () {

  describe('with proper input', function () {

    function test() {
      var app = connect();
      app.use(hpkp.apply(null, arguments));
      app.use(function (req, res) {
        res.end('Hello world!');
      });
      return request(app).get('/');
    }

    it('sets header with a multi-value array key called "sha256s"', function (done) {
      test({ maxAge: 10000, sha256s: ['abc123', 'xyz456'] })
      .expect('Public-Key-Pins', 'pin-sha256="abc123"; pin-sha256="xyz456"; max-age=10', done);
    });

    it('allows lowercase "maxage"', function (done) {
      test({ maxage: 10000, sha256s: ['abc123', 'xyz456'] })
      .expect('Public-Key-Pins', 'pin-sha256="abc123"; pin-sha256="xyz456"; max-age=10', done);
    });

    it('can include subdomains', function (done) {
      test({ maxage: 10000, sha256s: ['abc123', 'xyz456'], includeSubdomains: true })
      .expect('Public-Key-Pins', 'pin-sha256="abc123"; pin-sha256="xyz456"; max-age=10; includeSubdomains', done);
    });

    it('changes the header when using a report URI', function (done) {
      test({ maxage: 10000, sha256s: ['abc123', 'xyz456'], reportUri: 'http://example.com' })
      .expect('Public-Key-Pins-Report-Only', 'pin-sha256="abc123"; pin-sha256="xyz456"; max-age=10; report-uri="http://example.com"', done);
    });

    it('can disable Report-Only with a report URI', function (done) {
      test({
        maxage: 10000,
        sha256s: ['abc123', 'xyz456'],
        reportUri: 'http://example.com',
        reportOnly: false
      })
      .expect('Public-Key-Pins', 'pin-sha256="abc123"; pin-sha256="xyz456"; max-age=10; report-uri="http://example.com"', done);
    });

    it('changes the header when using a report URI and includes subdomains', function (done) {
      test({ maxage: 10000, sha256s: ['abc123', 'xyz456'], reportUri: 'http://example.com', includeSubdomains: true })
      .expect('Public-Key-Pins-Report-Only', 'pin-sha256="abc123"; pin-sha256="xyz456"; max-age=10; includeSubdomains; report-uri="http://example.com"', done);
    });

    it('rounds down to the nearest second', function (done) {
      test({ maxAge: 1234, sha256s: ['abc123', 'xyz456'] })
      .expect('Public-Key-Pins', 'pin-sha256="abc123"; pin-sha256="xyz456"; max-age=1', done);
    });

    it('rounds up to the nearest second', function (done) {
      test({ maxAge: 1567, sha256s: ['abc123', 'xyz456'] })
      .expect('Public-Key-Pins', 'pin-sha256="abc123"; pin-sha256="xyz456"; max-age=2', done);
    });

  });

  it('names its function and middleware', function () {
    assert.equal(hpkp.name, 'hpkp');
    assert.equal(hpkp.name, hpkp({ maxAge: 10000, sha256s: ['abc123', 'xyz456'] }).name);
  });

  describe('with improper input', function () {

    function callWith() {
      var args = arguments;
      return function () {
        return hpkp.apply(this, args);
      };
    }

    it('fails if called with no arguments', function () {
      assert.throws(callWith());
    });

    it('fails if called with an empty object', function () {
      assert.throws(callWith({}));
    });

    it('fails if called without a max-age', function () {
      assert.throws(callWith({ sha256s: ['abc123', 'xyz456'] }));
    });

    it('fails if called with fewer than 2 SHAs', function () {
      [
        undefined,
        null,
        'abc123',
        [],
        ['abc123']
      ].forEach(function (value) {
        assert.throws(callWith({ maxAge: 10000, sha256s: value }));
      });
    });

    it('fails if called with a zero maxAge', function () {
      assert.throws(callWith({ maxAge: 0, sha256s: ['abc123', 'xyz456'] }));
    });

    it('fails if called with a negative maxAge', function () {
      assert.throws(callWith({ maxAge: -1000, sha256s: ['abc123', 'xyz456'] }));
    });

    it('fails if called with both types of maxAge argument', function () {
      assert.throws(callWith({ maxAge: 1000, maxage: 1000, sha256s: ['abc123', 'xyz456'] }));
    });

    it('fails if called with reportOnly: true but no reportUri', function () {
      assert.throws(callWith({
        maxage: 10000,
        sha256s: ['abc123', 'xyz456'],
        reportOnly: true
      }));
    });

  });

});
