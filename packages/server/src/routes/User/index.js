const express = require(`express`);
const router = express.Router();
const { BadRequestError } = require(`restify-errors`);
const UserService = require(`../../libs/User`);
const passport = require(`passport`);

router.post(`/login`, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username) {
      reject(new BadRequestError(`Username not provided`));
    }
    if (!password) {
      reject(new BadRequestError(`Password not provided`));
    }

    // await UserService.login({ username, password });
      
    res.status(200).json(req.token);
  } catch (err) {
    next(err);
  }
});

router.get(`/logout`, (req, res, next) => {
  try {
    req.logout();
    req.session.destroy();
    res.status(200).json(`Successfully logged out`);
  } 
  catch (err) {
    next(err);
  }
});

router.get(`/cheese`, passport.authenticate(`local`), (req, res, next) => {
  res.send(`cheese`);
});

module.exports = router;