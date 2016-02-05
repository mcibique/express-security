'use strict';

let portHelper = require('../helpers/port');

describe('port helper tests', () => {
  it('should accept any positive number', () => {
    expect(portHelper.normalize(3000)).toBe(3000);
  });

  it('should accept any positive number as a string', () => {
    expect(portHelper.normalize('3000')).toBe(3000);
  });

  it('should ignore any falsy values', () => {
    expect(portHelper.normalize('')).toBe('');
    expect(portHelper.normalize(null)).toBe(null);
    expect(portHelper.normalize()).toBeUndefined();
  });

  it('should reject negative numbers', () => {
    expect(portHelper.normalize(-1)).toBe(false);
  });

  it('should reject negative numbers in a string', () => {
    expect(portHelper.normalize('-1')).toBe(false);
  });
});
