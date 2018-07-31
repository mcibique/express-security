import { expect } from 'chai';
import fs from 'fs';

let staticAssets = [{
  mime: 'text/css',
  url: '/assets/styles/app.min.css',
  serverPath: 'server/public/styles/app.min.css'
}, {
  mime: 'application/javascript',
  url: '/assets/scripts/app.min.js',
  serverPath: 'server/public/scripts/app.min.js'
}, {
  mime: 'image/png',
  url: '/assets/images/express-security-logo.png',
  serverPath: 'server/public/images/express-security-logo.png'
}];

describe('headers', function () {
  describe('hsts', function () {
    it('should have "strict-transport-security" header set for text/html', function () {
      return this.server.get('/')
        .redirects(1)
        .expect(200)
        .expect(function (response) {
          let hsts = response.headers['strict-transport-security'];
          expect(hsts).not.to.be.undefined;
          expect(hsts).to.contain('max-age=');
          expect(hsts).to.contain('includeSubDomains');
          expect(hsts).to.contain('preload');
        });
    });

    staticAssets.forEach(function (asset) {
      it(`should not have "strict-transport-security" header set for ${asset.mime}`, function () {
        return this.server.get(asset.url)
          .expect(200)
          .expect(function (response) {
            expect(response.header['strict-transport-security']).to.be.undefined;
          });
      });
    });
  });

  describe('x-frame-options', function () {
    it('should have "x-frame-options" header set for text/html', function () {
      return this.server.get('/')
        .redirects(1)
        .expect(200)
        .expect('x-frame-options', 'DENY');
    });

    staticAssets.forEach(function (asset) {
      it(`should not have "x-frame-options" header set for ${asset.mime}`, function () {
        return this.server.get(asset.url)
          .expect(200)
          .expect(function (response) {
            expect(response.header['x-frame-options']).to.be.undefined;
          });
      });
    });
  });

  describe('csp', function () {
    it('should have "csp" header set for text/html', function () {
      let cspRegex = /default-src 'self'; script-src 'self' 'nonce-[a-f0-9-]{36}'; style-src 'self' 'nonce-[a-f0-9-]{36}'; base-uri 'self'; connect-src 'self' wss:; frame-ancestors 'none'; report-uri https:\/\/report-uri.io\/report\/expresssecuritytest/;

      return this.server.get('/')
        .redirects(1)
        .expect(200)
        .expect(function (response) {
          expect(response.header['content-security-policy']).to.match(cspRegex);
        });
    });

    staticAssets.forEach(function (asset) {
      it(`should not have "csp" header set for ${asset.mime}`, function () {
        return this.server.get(asset.url)
          .expect(200)
          .expect(function (response) {
            expect(response.header['content-security-policy']).to.be.undefined;
          });
      });
    });
  });

  describe('dns prefetching', function () {
    it('should have DNS prefetching turned off for text/html', function () {
      return this.server.get('/')
        .redirects(1)
        .expect(200)
        .expect('x-dns-prefetch-control', 'off');
    });
  });

  describe('caching', function () {
    it('should have turned cache off for text/html', function () {
      return this.server.get('/')
        .redirects(1)
        .expect(200)
        .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        .expect('surrogate-control', 'no-store')
        .expect('pragma', 'no-cache')
        .expect(function (response) {
          expect(response.header.etag).to.be.undefined;
          expect(response.header['last-modified']).to.be.undefined;
        });
    });

    staticAssets.forEach(function (asset) {
      it(`should have turned cache on for ${asset.mime}`, function () {
        return this.server.get(asset.url)
          .expect(200)
          .expect('cache-control', 'public, max-age=31536000')
          .expect(function (response) {
            expect(response.header['surrogate-control']).to.be.undefined;
            expect(response.header.pragma).to.be.undefined;
          });
      });
    });

    describe('last-modified', function () {
      staticAssets.forEach(function (asset) {
        it(`should have "Last-Modified" header set for ${asset.mime}`, function () {
          let lastModifiedDate = new Date(fs.statSync(asset.serverPath).mtime).toGMTString(); // eslint-disable-line security/detect-non-literal-fs-filename
          return this.server.get(asset.url)
            .expect(200)
            .expect('last-modified', lastModifiedDate);
        });
      });
    });

    describe('etag', function () {
      staticAssets.forEach(function (asset) {
        it(`should have "ETag" header set for ${asset.mime}`, function () {
          return this.server.get(asset.url)
            .expect(200)
            .expect(function (response) {
              expect(response.header.etag).to.be.ok;
            });
        });
      });
    });
  });

  describe('public-key-pins', function () {
    it('should have "Public-Key-Pins" header for text/html', function () {
      return this.server.get('/')
        .redirects(1)
        .expect(200)
        .expect(function (response) {
          let pinsValue = response.header['public-key-pins'];
          expect(pinsValue).not.to.be.undefined;
          expect(pinsValue).to.contain('pin-sha256=');
          expect(pinsValue).to.contain('max-age=');
          expect(pinsValue).to.contain('report-uri=');
          expect(pinsValue).to.contain('includeSubDomains');
        });
    });

    staticAssets.forEach(function (asset) {
      it(`should not have "Public-Key-Pins" header set for ${asset.mime}`, function () {
        return this.server.get(asset.url)
          .expect(200)
          .expect(function (response) {
            expect(response.header['public-key-pins']).to.be.undefined;
          });
      });
    });
  });

  describe('referrer-policy', function () {
    it('should have "referrer-policy" header set for text/html', function () {
      return this.server.get('/')
        .redirects(1)
        .expect(200)
        .expect('referrer-policy', 'origin');
    });

    staticAssets.forEach(function (asset) {
      it(`should not have "referrer-policy" header set for ${asset.mime}`, function () {
        return this.server.get(asset.url)
          .expect(200)
          .expect(function (response) {
            expect(response.header['referrer-policy']).to.be.undefined;
          });
      });
    });
  });

  describe('expect-ct', function () {
    it('should have "expect-ct" header set for text/html', function () {
      return this.server.get('/')
        .redirects(1)
        .expect(200)
        .expect(function (response) {
          let expectCtValue = response.header['expect-ct'];
          expect(expectCtValue).not.to.be.undefined;
          expect(expectCtValue).to.contain('enforce,');
          expect(expectCtValue).to.contain('max-age=');
          expect(expectCtValue).to.contain('report-uri=');
        });
    });

    staticAssets.forEach(function (asset) {
      it(`should not have "expect-ct" header set for ${asset.mime}`, function () {
        return this.server.get(asset.url)
          .expect(200)
          .expect(function (response) {
            expect(response.header['expect-ct']).to.be.undefined;
          });
      });
    });
  });
});
