const express = require(`express`);
const router = express.Router();
const UserService = require(`../../libs/User`);
const { VerifyToken } = require(`../../utils/Middleware/VerifyToken`);
const multer = require(`multer`);
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { ResponseHandler } = require(`../../utils/ResponseHandler`);

router.get(`/:id`, async (req, res, next) => {
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

router.get(`/id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserDetails({ id });
    user.profilePicture = await UserService.getImageByKey({ image_key: user.image_key });

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get(`/id/:id/image`, async (req, res, next) => {
  try {
    const { id } = req.params;

    const userImage = await UserService.getUserImage({ id });

    return res.status(200).json(userImage);
  } catch (err) {
    next(err);
  }
});

router.put(`/update`, VerifyToken, upload.array(`pictures`, 10), async (req, res, next) => {
  try {
    const userData = req.body;
    if (!userData) {
      throw new Error(`Missing user data`);
    }
    const userId = await UserService.updateUser({ data: JSON.parse(userData.userData) });
    await UserService.uploadImages({ images: req.files, user: userId[0] });

    ResponseHandler(
      res,
      `User updated successfully`,
      { id: userId[0] },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/search`, VerifyToken, async (req, res, next) => {
  try {
    const { q } = req.query;

    const users = await UserService.searchUsers({ q });

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
