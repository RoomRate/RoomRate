const express = require(`express`);
const router = express.Router();
const PropertyService = require(`../../libs/Property`);
const { ResponseHandler } = require(`../../utils/ResponseHandler`);

router.get(`/list`, async (req, res, next) => {
  try {
    const properties = await PropertyService.getPropertyList({ all: req.params.all });

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
    const property = await PropertyService.getPropertyDetail({ id: req.params.id });

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

    ResponseHandler(
      res,
      `Got property reviews`,
      { reviews },
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
