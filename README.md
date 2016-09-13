# express security playground
My nodejs + express security and performance playground (boilerplate).

## Security

1. Cookie auth (secure, http-only, sameSite)
2. Signed session + sliding expiration
2. Cross-Site Request Forgery (CSRF)
3. Cross-Site WebSocket Hijacking (CSWSH)
9. Content-Security-Policy (CSP, nonce)
5. Strict-Transport-Security (HSTS)
10. Public-Key-Pins (HPKP)
3. X-Frame-Options
4. X-XSS-Protection
6. X-Powered-By
7. X-Download-Options
8. X-Content-Type-Options
9. Rate limits (number of requests per second)

## Performance

6. HTTP2
1. Client caching (cache-control, e-tags, expires, last-modified, cache busting)
2. Client assets minification
2. GZIP
3. Imagemin
4. Node cluster
5. Memory and redis caching

## Others

1. HTTPS
1. Redis store (session, caching)
1. Web sockets (socket.io, cookies authentication, shared session, redis store)
3. Logging (winston -> Console, FileSystem)
4. Custom errors (4XX, 5XX)
5. Configuration + Environment (config.json + config.dev.json)
6. Nodemon
7. Webpack + babel + SASS + postcss + autoprefixer
8. Unit tests
9. E2E tests
9. ESLint 2 (linting server, client, tests and pug templates)
9. npm scripts (npm-run-all, client tasks, server tasks)
9. http://realfavicongenerator.net/
9. Pug view engine
