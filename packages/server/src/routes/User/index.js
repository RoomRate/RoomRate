const express = require(`express`);
const router = express.Router();
const { BadRequestError } = require(`restify-errors`);
const UserService = require(`../../libs/User`);
const passport = require(`passport`);

router.post(`/login`, passport.authenticate(`local`), async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      next(new BadRequestError(`Username not provided`));
    }
    if (!password) {
      next(new BadRequestError(`Password not provided`));
    }

    const user = await UserService.login({ username, password });
    delete user.password;

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

router.get(`/cheese`, (req, res) => {
  res.send(`If you can see this page, you are logged in`);
});

module.exports = router;
