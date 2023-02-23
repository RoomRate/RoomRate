const { auth } = require(`../Firebase`);

exports.VerifyToken = async (req, res, next) => {
  const { 1: token } = req.headers.authorization.split(` `);

  try {
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;

      return next();
    }
  } catch (err) {
    return res.json({ message: `Internal Error` });
  }
};
