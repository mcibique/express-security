'use strict';

const baseUrl = 'https://localhost:5000';
let request = require('request');
let fs = require('fs');

describe('server', () => {
  it('should have x-frame-options set to deny for text/html', (cb) => {
    request.get({
      url: baseUrl
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['x-frame-options']).toBe('DENY');
      cb();
    });
  });

  it('should not have x-frame-options set for text/css', (cb) => {
    request.get({
      url: `${baseUrl}/styles/default.css`
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['x-frame-options']).not.toBeDefined();
      cb();
    });
  });

  it('should have CSP set for text/html', (cb) => {
    request.get({
      url: baseUrl
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-security-policy']).toBe('base-uri \'self\'; default-src \'self\'; frame-' +
        'ancestors \'none\'; report-uri https://report-uri.io/report/expresssecuritytest; script-src \'self\' ' +
        '\'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'');
      cb();
    });
  });

  it('should not have CSP set for text/css', (cb) => {
    request.get({
      url: `${baseUrl}/styles/default.css`
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-security-policy']).not.toBeDefined();
      cb();
    });
  });

  it('should have turned cache off for text/html', (cb) => {
    request.get({
      url: baseUrl
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['cache-control']).toBe('no-store, no-cache, must-revalidate, proxy-revalidate');
      expect(response.headers['surrogate-control']).toBe('no-store');
      expect(response.headers.pragma).toBe('no-cache');
      expect(response.headers.etag).not.toBeDefined();
      expect(response.headers['last-modified']).not.toBeDefined();
      cb();
    });
  });

  it('should have turned cache on for text/css', (cb) => {
    request.get({
      url: `${baseUrl}/styles/default.css`
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['cache-control']).toBe('public, max-age=31536000');
      expect(response.headers['surrogate-control']).not.toBeDefined();
      expect(response.headers.pragma).not.toBeDefined();
      cb();
    });
  });

  it('should have "Last-Modified" header for text/css', (cb) => {
    request.get({
      url: `${baseUrl}/styles/default.css`
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      let lastModifiedDate = new Date(fs.statSync('public/styles/default.css').mtime).toGMTString();
      expect(response.headers['last-modified']).toBe(lastModifiedDate);
      cb();
    });
  });

  it('should have "ETag" header for text/css', (cb) => {
    request.get({
      url: `${baseUrl}/styles/default.css`
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers.etag).toBeDefined();
      cb();
    });
  });

  it('should have "Public-Key-Pins" header for text/html', (cb) => {
    request.get({
      url: baseUrl
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      const pinsValue = response.headers['public-key-pins'];
      expect(pinsValue).toBeDefined();
      let containsPins = pinsValue.indexOf('pin-sha256=') >= 0;
      expect(containsPins).toBe(true);
      let containsMaxAge = pinsValue.indexOf('max-age=') >= 0;
      expect(containsMaxAge).toBe(true);
      let containsReportUri = pinsValue.indexOf('report-uri=') >= 0;
      expect(containsReportUri).toBe(true);
      cb();
    });
  });
});
