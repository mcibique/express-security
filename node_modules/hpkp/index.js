var badArgumentsError = new Error('hpkp must be called with a maxAge and at least two SHA-256s (one actually used and another kept as a backup).');

module.exports = function hpkp(passedOptions) {
  var options = parseOptions(passedOptions);
  var headerKey = getHeaderKey(options);
  var headerValue = getHeaderValue(options);

  return function hpkp(req, res, next) {
    res.setHeader(headerKey, headerValue);
    next();
  };
};

function parseOptions(options) {
  if (!options) { throw badArgumentsError; }

  if (options.maxage && options.maxAge) { throw badArgumentsError; }

  var maxAge = options.maxAge || options.maxage;
  var sha256s = options.sha256s;

  if (!maxAge || maxAge <= 0) { throw badArgumentsError; }
  if (!sha256s || sha256s.length < 2) { throw badArgumentsError; }

  var reportOnly;
  if (options.reportOnly === undefined) {
    reportOnly = Boolean(options.reportUri);
  } else {
    reportOnly = options.reportOnly;
  }

  if (reportOnly && !options.reportUri) { throw badArgumentsError; }

  return {
    maxAge: maxAge,
    sha256s: sha256s,
    includeSubdomains: options.includeSubdomains,
    reportUri: options.reportUri,
    reportOnly: reportOnly
  };
}

function getHeaderKey(options) {
  var header = 'Public-Key-Pins';
  if (options.reportOnly) {
    header += '-Report-Only';
  }
  return header;
}

function getHeaderValue(options) {
  var result = options.sha256s.map(function (sha) {
    return 'pin-sha256="' + sha + '"';
  });
  result.push('max-age=' + Math.round(options.maxAge / 1000));
  if (options.includeSubdomains) {
    result.push('includeSubdomains');
  }
  if (options.reportUri) {
    result.push('report-uri="' + options.reportUri + '"');
  }
  return result.join('; ');
}
