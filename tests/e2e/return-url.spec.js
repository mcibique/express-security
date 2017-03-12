describe('return url', function () {
  describe('when redirecting to login', function () {
    it('should have returnUrl', function () {
      let url = '/user/?id=1';

      return this.server.get(url)
        .expect(303)
        .expect('Location', `/login/?returnUrl=${encodeURIComponent(url)}`);
    });

    describe('and returnUrl is absolute URL', function () {
      it('should replace it with default returnUrl', function () {
        let maliciousDomain = 'http://whatever.com';

        return this.server.get(`/login?returnUrl=${encodeURIComponent(maliciousDomain)}`)
          .expect(302)
          .expect('Location', `/login/?returnUrl=${encodeURIComponent('/')}`);
      });
    });
  });
});
