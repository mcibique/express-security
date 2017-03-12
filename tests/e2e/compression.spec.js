import { expect } from 'chai';

let assetsWithCompression = [{
  mime: 'text/html',
  url: '/',
  redirects: 1,
  skip: ['br']
}, {
  mime: 'text/css',
  url: '/assets/styles/app.min.css'
}, {
  mime: 'application/javascript',
  url: '/assets/scripts/app.min.js'
}];

let assetsWithoutCompression = [{
  mime: 'image/png',
  url: '/assets/images/express-security-logo.png'
}];

function filterAssetsSupportingCompression(assets, compression) {
  return assets.filter(asset => {
    if (asset.skip) {
      return !asset.skip.includes(compression);
    }
    return true;
  });
}

describe('compression', function () {
  ['gzip', 'br', 'deflate'].forEach(function (compression) {
    describe(compression, function () {
      describe('when is enabled', function () {
        filterAssetsSupportingCompression(assetsWithoutCompression, compression).forEach(function (asset) {
          it(`should not compress ${asset.mime} using ${compression}`, function () {
            return this.server
              .get(asset.url)
              .set('Accept-Encoding', compression)
              .expect(200)
              .expect(function (response) {
                expect(response.header['content-encoding']).to.be.undefined;
                expect(response.header['content-length']).to.be.ok;
              });
          });
        });

        filterAssetsSupportingCompression(assetsWithCompression, compression).forEach(function (asset) {
          it(`should compress ${asset.mime} using ${compression}`, function () {
            return this.server
              .get(asset.url)
              .redirects(asset.redirects)
              .set('Accept-Encoding', compression)
              .expect(200)
              .expect(function (response) {
                expect(response.header['content-encoding']).to.equal(compression);

                if (asset.mime !== 'text/html') {
                  expect(response.header.etag).to.match(/^W\/.+/);
                }
              });
          });
        });
      });

      describe('when is not enabled', function () {
        filterAssetsSupportingCompression([...assetsWithCompression, ...assetsWithoutCompression], compression)
          .forEach(function (asset) {
            it(`should not compress ${asset.mime} using ${compression}`, function () {
              return this.server
                .get(asset.url)
                .redirects(asset.redirects)
                .set('Accept-Encoding', '')
                .expect(200)
                .expect(function (response) {
                  expect(response.header['content-encoding']).to.be.undefined;
                });
            });
          });
      });
    });
  });
});
