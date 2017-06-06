# express security playground
My nodejs + express security and performance playground (boilerplate).

## Security [![Known Vulnerabilities](https://snyk.io/test/github/mcibique/express-security/badge.svg)](https://snyk.io/test/github/mcibique/express-security)

1. Cookie auth (secure, http-only, sameSite)
1. Signed session + sliding expiration
1. Cross-Site Request Forgery (CSRF)
1. Cross-Site WebSocket Hijacking (CSWSH)
1. Content-Security-Policy (CSP, nonce)
1. Strict-Transport-Security (HSTS)
1. Public-Key-Pins (HPKP)
1. X-Frame-Options
1. X-XSS-Protection
1. X-Powered-By
1. X-Download-Options
1. X-Content-Type-Options
1. Rate limits (number of requests per second)

## Performance

1. HTTP2
1. Client caching (cache-control, e-tags, expires, last-modified, cache busting)
1. Client assets minification
1. GZIP, deflate
1. Precompressed assets (Brotli and Gzip support)
1. Imagemin
1. Node cluster
1. Memory and redis caching

## Others

1. HTTPS
1. Redis store (session, caching)
1. Web sockets (socket.io, cookies authentication, shared session, redis store)
1. Logging (winston -> Console, FileSystem)
1. Custom errors (4XX, 5XX)
1. Configuration + Environment (config.json + config.dev.json)
1. Nodemon
1. Webpack + babel + SASS + postcss + autoprefixer
1. ES6 modules (babel, babel-preset-env)
1. Unit tests (ES6, mocha + chai)
1. E2E tests (ES6, mocha + chai, supertest + superagent)
1. ESLint 3 (linting server, client, tests and pug templates)
1. npm scripts (npm-run-all, cross-env, client tasks, server tasks)
1. http://realfavicongenerator.net/
1. Pug view engine
1. nsp and snyk
