import { expect } from 'chai';
import { isJson } from 'helpers/request';

describe('request', function () {
  let requestMock;
  beforeEach(function () {
    requestMock = { headers: {} };
  });

  describe('isJson()', function () {
    describe('when accept header is missing', function () {
      beforeEach(function () {
        requestMock.headers.accept = null;
      });

      it('should return false', function () {
        expect(isJson(requestMock)).to.be.false;
      });
    });

    describe('when accept header is present', function () {
      describe('and accepts json', function () {
        beforeEach(function () {
          requestMock.headers.accept = 'application/json';
        });

        it('should return true', function () {
          expect(isJson(requestMock)).to.be.true;
        });
      });

      describe('and accepts json and any other mime type', function () {
        beforeEach(function () {
          requestMock.headers.accept = 'text/html, application/json';
        });

        it('should return true', function () {
          expect(isJson(requestMock)).to.be.true;
        });
      });

      describe('and doesn\'t accept json', function () {
        beforeEach(function () {
          requestMock.headers.accept = 'text/html';
        });

        it('should return false', function () {
          expect(isJson(requestMock)).to.be.false;
        });
      });
    });
  });
});
