const express = require(`express`);
const router = express.Router();
const PropertyService = require(`../../libs/Property`);
const { ResponseHandler } = require(`../../utils/ResponseHandler`);

router.get(`/list`, async (req, res, next) => {
  try {
    const properties = await PropertyService.getPropertyList({ all: req.params.all });

    ResponseHandler(
      res,
      `Got case load`,
      { properties },
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
