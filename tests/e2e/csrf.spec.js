describe('csrf', function () {
  let request;

  beforeEach(function () {
    request = this.server.post('/login');
  });

  describe('when token is not present', function () {
    it('should return back to login', function () {
      return request
        .field('username', 'a')
        .field('password', 'b')
        .expect(303)
        .expect('Location', '/login');
    });
  });

  describe('when token is wrong', function () {
    it('should return back to login', function () {
      return request
        .field('username', 'a')
        .field('password', 'b')
        .field('_csrf', 'random invalid token')
        .expect(303)
        .expect('Location', '/login');
    });
  });
});
