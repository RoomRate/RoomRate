exports.ErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.statusCode === 500) {
    // TODO log out the error here instead of console.error
    // eslint-disable-next-line no-console
    console.error(err);

    return res.status(500).json({
      message: `An unknown error occurred`,
      status: `ERROR`,
    });
  }

  return res.status(err.statusCode || 500).json({
    message: err || `An unknown error occurred`,
    status: `ERROR`,
  });
};
