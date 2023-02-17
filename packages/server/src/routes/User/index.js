const express = require(`express`);
const router = express.Router();
const { BadRequestError } = require(`restify-errors`);
const UserService = require(`../../libs/User`);
const { VerifyToken } = require(`../../utils/Middleware/VerifyToken`);

router.post(`/login`, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      next(new BadRequestError(`Email not provided`));
    }
    if (!password) {
      next(new BadRequestError(`Password not provided`));
    }

    const user = await UserService.login({ email, password });

    return res
      .status(200)
      .json({
        message: `Successfully logged in`,
        data: user,
      });
  } catch (err) {
    return next(err);
  }
});

router.get(`/logout`, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy();
    res.status(200).json({
      message: `Successfully logged out`,
    });
  });
});

router.get(`/:id`, VerifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserById({ id });

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.post(`/new`, async (req, res, next) => {
  try {
    const { uid, email, firstName, lastName } = req.body;

    const user = await UserService.addUserFromFirebase({ uid, email, firstName, lastName });

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
