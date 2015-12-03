var ienoopen = require('..');

var assert = require('assert');
var connect = require('connect');
var request = require('supertest');

describe('ienoopen', function () {

  var app;
  beforeEach(function () {
    app = connect();
    app.use(ienoopen());
    app.use(function (req, res) {
      res.setHeader('Content-Disposition', 'attachment; filename=somefile.txt');
      res.end('Download this cool file!');
    });
  });

  it('sets header properly', function (done) {
    request(app).get('/')
    .expect('X-Download-Options', 'noopen', done);
  });

  it('names its function and middleware', function () {
    assert.equal(ienoopen.name, 'ienoopen');
    assert.equal(ienoopen().name, 'ienoopen');
  });

});
