export const DEFAULT_PORT = 8443;
export const SERVER_PORT = normalizePort(process.env.PORT || DEFAULT_PORT);

export function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
