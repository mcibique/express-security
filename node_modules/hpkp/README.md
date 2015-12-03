# HTTP Public Key Pinning (HPKP) middleware

Adds Public Key Pinning headers to Express/Connect applications. To learn more about HPKP, check out [the spec](https://tools.ietf.org/html/rfc7469), [the article on MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Public_Key_Pinning), and [this tutorial](https://timtaubert.de/blog/2014/10/http-public-key-pinning-explained/).

Usage:

```js
var express = require('express');
var hpkp = require('hpkp');

var app = express();

var ninetyDaysInMilliseconds = 7776000000;
app.use(hpkp({
  maxAge: ninetyDaysInMilliseconds,
  sha256s: ['AbCdEf123=', 'ZyXwVu456='],
  includeSubdomains: true,         // optional
  reportUri: 'http://example.com'  // optional
}));
```

Specifying a `report-uri` changes the header from `Public-Key-Pins` to `Public-Key-Pins-Report-Only`. To reverse this, set another option: `reportOnly: false`. This behavior will change in the 1.0 release.
