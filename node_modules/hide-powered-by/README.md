Hide X-Powered-By
=================

Simple middleware to remove the `X-Powered-By` HTTP header if it's set.

Hackers can exploit known vulnerabilities in Express/Node if they see that your site is powered by Express (or whichever framework you use). For example, `X-Powered-By: Express` is sent in every HTTP request coming from Express, by default.

The `hidePoweredBy` middleware will remove the `X-Powered-By` header if it is set (which it will be by default in Express).

```javascript
var hidePoweredBy = require('hide-powered-by');
app.use(hidePoweredBy());
```

You can also explicitly set the header to something else, if you want. This could throw people off:

```javascript
app.use(hidePoweredBy({ setTo: 'PHP 4.2.0' }));
```

Note: if you're using Express, you can skip this middleware if you want:

```javascript
app.disable('x-powered-by');
```
