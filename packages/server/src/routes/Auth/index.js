const router = require(`express`).Router();
const passport = require(`passport`);

router.get(`/local`, passport.authenticate(`local`));

module.exports = router;
