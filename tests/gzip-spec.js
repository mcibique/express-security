'use strict';

const baseUrl = 'https://localhost:5000';
let request = require('request');

describe('server', () => {
  it('should gzip text/html', (cb) => {
    request.get({
      url: baseUrl,
      gzip: true
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-encoding']).toBe('gzip');
      cb();
    });
  });
});
