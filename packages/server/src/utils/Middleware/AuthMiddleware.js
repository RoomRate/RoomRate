exports.AuthMiddleware = (req, res, next) => {
  const authenticatedRoutes = [
    `/api/user/logout`,
    `/api/property/review/new`,
    `/api/property/new`,
    `/api/chat/list`,
    `/api/chat/:chat_id/messages`,
    `/api/chat/:chat_id/message`,
    `/api/chat/:chat_id/users`,
    `/api/chat/:chat_id/message`,
    `/api/chat/:chat_id`,
  ];

  let match = false;
  authenticatedRoutes.forEach(route => {
    if (route.includes(`:`)) {
      const regex = new RegExp(`^${ route.replace(/:[^/]+/, `([^/]+)`) }$`);
      match = regex.test(req.originalUrl);
    } else {
      match = route === req.originalUrl;
    }

    if (match) {
      return res
        .status(403)
        .json({
          message: `Forbidden`,
          status: `FORBIDDEN`,
        });
    }
  });

  if (!match) {
    next();
  }
};
