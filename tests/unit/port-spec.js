import { normalizePort } from '../../server/helpers/port';

describe('port helper tests', function () {
  it('should accept any positive number', function () {
    expect(normalizePort(3000)).toBe(3000);
  });

  it('should accept any positive number as a string', function () {
    expect(normalizePort('3000')).toBe(3000);
  });

  it('should ignore any falsy values', function () {
    expect(normalizePort('')).toBe('');
    expect(normalizePort(null)).toBe(null);
    expect(normalizePort()).toBeUndefined();
  });

  it('should reject negative numbers', function () {
    expect(normalizePort(-1)).toBe(false);
  });

  it('should reject negative numbers in a string', function () {
    expect(normalizePort('-1')).toBe(false);
  });
});
