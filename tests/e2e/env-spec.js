'use strict';

beforeEach(() => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  jasmine.getEnv().defaultTimeoutInterval = 1000;
});
