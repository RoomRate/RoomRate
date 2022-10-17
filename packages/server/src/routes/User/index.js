const express = require(`express`);
const router = express.Router();
const { BadRequestError } = require(`restify-errors`);
const UserService = require(`../../libs/User`);
const passport = require(`passport`);

router.post(`/login`, passport.authenticate(`local`), async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      throw new BadRequestError(`Username not provided`);
    }
    if (!password) {
      throw new BadRequestError(`Password not provided`);
    }

    const user = await UserService.login({ username, password });

    return res
      .status(200)
      .json({
        message: `Successfully logged in`,
        data: user,
      });
  } catch (err) {
    throw new Error(`An error occurred when attempting to login`);
  }
});

router.get(`/logout`, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy();
    res.status(200).json(`Successfully logged out`);
  });
});

router.get(`/cheese`, (req, res) => {
  res.send(`If you can see this page, you are logged in`);
});

module.exports = router;
