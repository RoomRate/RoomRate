const express = require(`express`);
const router = express.Router();
const UserService = require(`../../libs/User`);
const { VerifyToken } = require(`../../utils/Middleware/VerifyToken`);

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

router.get(`/uid/:uid`, async (req, res, next) => {
  try {
    const { uid } = req.params;

    const user = await UserService.getUserFromFirebaseUid({ uid });

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.put(`/update`, VerifyToken, async (req, res, next) => {
  try {
    const { data } = req.body;
    console.log(`routes:`, req.body);
    const user = await UserService.updateUser({ data });

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
