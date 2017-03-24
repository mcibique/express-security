export function isJson(req) {
  return !!(req.headers.accept && req.headers.accept.includes('application/json'));
}

export function isAjaxRequest(req) {
  return req.xhr || isJson(req);
}
