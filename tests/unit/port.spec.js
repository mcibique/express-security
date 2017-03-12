import { expect } from 'chai';
import { normalizePort } from '../../server/helpers/port';

describe('port helper tests', function () {
  it('should accept any positive number', function () {
    expect(normalizePort(3000)).to.equal(3000);
  });

  it('should accept any positive number as a string', function () {
    expect(normalizePort('3000')).to.equal(3000);
  });

  it('should ignore any falsy values', function () {
    expect(normalizePort('')).to.equal('');
    expect(normalizePort(null)).to.be.null;
    expect(normalizePort()).to.be.undefined;
  });

  it('should reject negative numbers', function () {
    expect(normalizePort(-1)).to.be.false;
  });

  it('should reject negative numbers in a string', function () {
    expect(normalizePort('-1')).to.be.false;
  });
});
