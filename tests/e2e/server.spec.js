import { expect } from 'chai';

let staticAssets = [{
  mime: 'text/css',
  url: '/assets/styles/app.min.css',
  wrongUrl: '/assets/styles/app1.min.css'
}, {
  mime: 'application/javascript',
  url: '/assets/scripts/app.min.js',
  wrongUrl: '/assets/scripts/app1.min.js'
}, {
  mime: 'image/png',
  url: '/assets/images/express-security-logo.png',
  wrongUrl: '/assets/images/express-security-logo-1.png'
}, {
  mime: 'favicon',
  url: '/favicon.ico'
}];

describe('server', function () {
  describe('when serving views', function () {
    it('should serve /', function () {
      return this.server.get('/')
        .expect(function (response) {
          expect(response.statusCode).to.be.below(400);
        });
    });

    it('should redirect unauthorized requests to /login url', function () {
      let url = '/';
      return this.server.get(url)
        .expect(303)
        .expect('Location', `/login/?returnUrl=${encodeURIComponent(url)}`);
    });

    it('should redirect unknown-url to /login url', function () {
      let url = '/unknown-url';
      return this.server.get(url)
        .expect(303)
        .expect('Location', `/login/?returnUrl=${encodeURIComponent(url)}`);
    });
  });

  describe('when serving assets', function () {
    describe('and the file exists', function () {
      staticAssets.forEach(function (asset) {
        it(`should serve ${asset.mime}`, function () {
          return this.server.get(asset.url).expect(200);
        });
      });
    });

    describe('and the file doesn\'t exist', function () {
      staticAssets.filter(asset => !!asset.wrongUrl).forEach(function (asset) {
        it(`should return 404 for ${asset.mime}`, function () {
          return this.server.get(asset.wrongUrl).expect(404);
        });
      });
    });
  });
});
