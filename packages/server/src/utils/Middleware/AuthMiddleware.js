exports.AuthMiddleware = (req, res, next) => {
  const unauthenticatedRoutes = [
    `/user/login`,
  ];

  if (unauthenticatedRoutes.includes(req.originalUrl)) {
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }

  return res
    .status(403)
    .json({
      message: `Forbidden`,
      status: `FORBIDDEN`,
    });
};
