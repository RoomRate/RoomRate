const express = require(`express`);
const router = express.Router();
const { BadRequestError } = require(`restify-errors`);
const UserService = require(`../../libs/UserService`);

router.post(`/login`, async (req, res, next) => {
  return new Promise((resolve, reject) => {
    try {
      const { username, password, confirmPassword } = req.body;
    
      if (!username) {
        reject(new BadRequestError(`Username not provided`));
      }
      if (!password) {
        reject(new BadRequestError(`Password not provided`));
      }
      if (password !== confirmPassword) {
        reject(new BadRequestError(`Passwords do not match`));
      }

      UserService.login({ username, password });
      
      res.status(200).json(req.token);
    } catch (err) {
      next(err);
    }
  });
});

module.exports = router;