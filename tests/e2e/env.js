import supertest from 'supertest';

before(function () {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
});

beforeEach(function () {
  this.server = supertest.agent('https://localhost:5000');
});
