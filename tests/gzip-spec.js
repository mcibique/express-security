'use strict';

const baseUrl = 'https://localhost:5000';
const jsSample = `${baseUrl}/scripts/app.min.js`;
const cssSample = `${baseUrl}/styles/app.min.css`;
let request = require('request');

describe('gzip', () => {
  it('should gzip text/html', (cb) => {
    request.get({
      url: baseUrl,
      gzip: true
    }, (error, response) => {
      if (error) {
        return cb(error);
      }
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-encoding']).toBe('gzip');
      cb();
    });
  });

  it('should gzip text/css', (cb) => {
    request.get({
      url: cssSample,
      gzip: true
    }, (error, response) => {
      if (error) {
        return cb(error);
      }
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-encoding']).toBe('gzip');
      cb();
    });
  });

  it('should gzip application/javascript', (cb) => {
    request.get({
      url: jsSample,
      gzip: true
    }, (error, response) => {
      if (error) {
        return cb(error);
      }
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-encoding']).toBe('gzip');
      cb();
    });
  });
});
