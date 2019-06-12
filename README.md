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

## How to run

Disclaimer: The main purpose of this repository is to demonstrate security, caching and performance principles, it's not about DB, UI, UX.

**Certificate**

The application runs only on HTTPS, so a certificate is required. If you want to just try it locally, then [generate self-signed certificate online](http://www.selfsignedcertificate.com/) for domain `localhost` and save both files into the `server/certificates/` folder. Name them `server.cert` and `server.key`.

**Redis**
The application uses Redis to store sessions, caching, websockets and saving rate limits. Please follow their [installation guide](https://redis.io/topics/quickstart).

### Production build

1. run `yarn install` or `npm install`
2. run `yarn run start` or `npm run start`
3. open URL `https://localhost:8443/` in a browser (you can change the port if you re-run the previous command with `PORT=8444 yarn run start`)
4. use any username and password to log in. There is no real DB behind the app, it's not the main purpose of the demo.

### Development

1. run `yarn install` or `npm install`
2. run `yarn run build:client`
3. run `yarn run watch:server` (runs nodemon so any change in server's code immediately restarts server)
4. open URL `https://localhost:5000/` in a browser (you can change the port in `nodemon.json`)

### Running the cluster

The application can run as a [cluster of node applications](https://nodejs.org/api/cluster.html). Use `"useCluster"` option in `server/config/config.json`:
* "auto": no cluster in dev mode, all possible cores in prod mode.
* true: all possible cores in all modes.
* any number: spawn a given number of instances.
* anything else: no cluster in any mode.

### Configuring application
You can change `server/config/config.json` file directly. If you are in development mode and you don't want to commit your config changes, then create `config.dev.json` next to the original JSON file and store your overrides there. Both configs are deeply merged together, `config.dev.json` takes precedence.

### Running tests
* run `yarn run test:unit` to run unit tests only
* run `yarn run test:vulnerabilities` to check app dependencies for vulnerabilities (using [nsp](https://www.npmjs.com/package/nsp))

to run e2e tests, you have to start the server in development first
* then run `yarn run test:e2e`

If you want to run all tests, start the server in development mode and then run `yarn run test`

The application uses rate limiters to prevent hundreds of requests from the same IP address. This protection must be turned off while running e2e tests, otherwise the tests will start to fail randomly after the limits are reached. To turn it off, create `config.dev.json` and add into it:
```json
{
  "rateLimiter": {
    "enabled": false
  }
}
```