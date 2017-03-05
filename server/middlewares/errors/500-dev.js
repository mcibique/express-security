export default function handle500dev(err, req, res) {
  res.status(err.status || 500);
  // will print the stacktrace
  res.render('error', {
    message: err.message,
    error: err
  });
}
