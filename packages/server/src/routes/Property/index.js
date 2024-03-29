const express = require(`express`);
const router = express.Router();
const PropertyService = require(`../../libs/Property`);
const { ResponseHandler } = require(`../../utils/ResponseHandler`);
const multer = require(`multer`);
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { VerifyToken } = require(`../../utils/Middleware/VerifyToken`);
const UserService = require(`../../libs/User`);

router.get(`/list`, async (req, res, next) => {
  try {
    const properties = await PropertyService.getPropertyList({ filter: req.query.filter });

    ResponseHandler(
      res,
      `Got property list`,
      { properties },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:id/detail`, async (req, res, next) => {
  try {
    const [ property, images ] = await Promise.all([
      PropertyService.getPropertyDetail({ id: req.params.id }),
      PropertyService.getPropertyImages({ id: req.params.id }),
    ]);
    property.images = images;

    ResponseHandler(
      res,
      `Got property detail`,
      { property },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:id/reviews`, async (req, res, next) => {
  try {
    const reviews = await PropertyService.getReviews({ id: req.params.id });

    await Promise.all(reviews.map(async review => {
      review.userImage = await UserService.getImageByKey({ image_key: review.image_key });
    }));


    ResponseHandler(
      res,
      `Got property reviews`,
      { reviews },
    );
  } catch (err) {
    next(err);
  }
});

router.post(`/review/new`, VerifyToken, async (req, res, next) => {
  try {
    const { review, user_id } = req.query;

    await PropertyService.createReview({ review, user_id });

    ResponseHandler(
      res,
      `Created new review`,
      {},
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/states`, async (req, res, next) => {
  try {
    const states = await PropertyService.getStates();

    ResponseHandler(
      res,
      `Got property reviews`,
      { states },
    );
  } catch (err) {
    next(err);
  }
});

router.post(`/new`, VerifyToken, upload.array(`pictures`, 10), async (req, res, next) => {
  try {
    const { id } = await PropertyService.createProperty({ property: JSON.parse(req.body.data) });
    await PropertyService.uploadImages({ images: req.files, propertyId: id });

    ResponseHandler(
      res,
      `Created New Property`,
      { id },
    );
  }
  catch (err) {
    next(err);
  }
});

router.get(`/search`, async (req, res, next) => {
  try {
    const properties = await PropertyService.searchProperties({ input: req.query.input });

    ResponseHandler(
      res,
      `Got property list`,
      properties,
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:property_id/thumbnail`, async (req, res, next) => {
  try {
    const { property_id } = req.params;
    const thumbnail = await PropertyService.getPropertyThumbnail({ property_id });

    return res.status(200).json(thumbnail);
  } catch (err) {
    next(err);
  }
});

router.get(`/user/:user_id`, async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const properties = await PropertyService.getPropertiesForUser({ user_id });

    return res.status(200).json(properties);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
