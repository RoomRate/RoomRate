const { attachCoordinates } = require(`../../utils/Geocoder`);
const knex = require(`../Database`);
const { s3download, s3Upload } = require(`../../utils/S3`);
const { v4: uuidv4 } = require(`uuid`);
const moment = require(`moment`);
const _ = require(`lodash`);

exports.getPropertyList = async ({ filter = {} }) => {
  let orderBy = { column: `id`, order: `asc` };
  if (filter.sortBy === `priceAsc`) {
    orderBy = { column: `rate`, order: `asc` };
  }
  else if (filter.sortBy === `priceDesc`) {
    orderBy = { column: `rate`, order: `desc` };
  }
  else if (filter.sortBy === `newer`) {
    orderBy = { column: `id`, order: `desc` };
  }
  else if (filter.sortBy === `older`) {
    orderBy = { column: `id`, order: `asc` };
  }

  let properties = await knex(`properties`)
    .where(qb => {
      if (filter.minPrice) {
        qb.where(`rate`, `>=`, Number(filter.minPrice));
      }
      if (filter.maxPrice) {
        qb.where(`rate`, `<=`, Number(filter.maxPrice));
      }
      if (filter.bedrooms) {
        qb.where(`bed`, Number(filter.bedrooms));
      }
      if (filter.bathrooms) {
        qb.where(`bath`, Number(filter.bathrooms));
      }
      if (filter.type) {
        qb.whereIn(`propType`, filter.type);
      }
      if (filter.search) {
        qb.whereRaw(`CONCAT(street_1,' ',street_2) like '%${ filter.search }%'`);
      }
      if (filter.policies) {
        const _policies = _.pickBy(_.mapValues(filter.policies, (value) => value === `true`), _.identity);
        if (_policies !== {})
        {
          qb.whereRaw(`policies::jsonb @> ?::jsonb`, [ _policies ]);
        }
      }
    })
    .orderBy(orderBy.column, orderBy.order);

  properties = await Promise.all(properties.map(async p => {
    const [ coords, peopleCount ] = await Promise.all([
      attachCoordinates({ property: p }),
      knex(`roommate_posts`).count(`property_id`).where(`property_id`, p.id),
    ]);

    p.coords = coords;
    p.peopleInterested = peopleCount[0].count;

    return p;
  }));

  if (filter.minDistance) {
    properties = properties.filter(p => Number(p.coords.distanceInMiles) >= Number(filter.minDistance));
  }
  if (filter.maxDistance) {
    properties = properties.filter(p => Number(p.coords.distanceInMiles) <= Number(filter.maxDistance));
  }

  return properties;
};

exports.getPropertyDetail = async ({ id }) => {
  const property = await knex(`properties`).where(`id`, id).first();
  const [ coords, peopleInterested, landlord ] = await Promise.all([
    attachCoordinates({ property }),
    knex(`roommate_posts`).count(`property_id`).where(`property_id`, id),
    knex(`users`).where(`id`, property.landlord_id).first(),
  ]);

  property.coords = coords;
  property.peopleInterested = peopleInterested;
  property.landlord = landlord;

  return property;
};

exports.getReviews = async ({ id }) => {
  const reviews = await knex.raw(`
    SELECT * 
    FROM property_reviews
    JOIN users ON property_reviews.user_id = users.id
    WHERE property_reviews.property_id = ?
    ORDER BY date DESC
    `, [ id ]);

  return reviews.rows;
};

exports.createReview = async ({ review, user_id }) => {
  await knex.insert({
    rating: review.rating,
    message: review.message,
    user_id,
    date: moment().format(`MM/DD/YYYY`),
    property_id: review.id,
  }).into(`property_reviews`);
};

exports.getStates = async () => {
  const states = await knex.raw(
    `
    SELECT *
    FROM states`,
  );

  return states.rows;
};

exports.getPropertyImages = async ({ id }) => {
  const propertyImageKeys = await knex.raw(`
    SELECT image_key
    FROM property_images
    JOIN properties ON properties.id = property_images.property_id
    WHERE property_images.property_id = ?
  `, [ id ]);

  const propertyImages = await Promise.all(propertyImageKeys.rows.map(async key => await s3download(key.image_key)));

  return propertyImages;
};

exports.createProperty = async ({ property }) => {
  const newProperty = await knex.insert({
    street_1: property.address.label,
    street_2: property.unitNo,
    details: property.description,
    bed: property.bed.value,
    bath: property.bath.value,
    rate: property.price.replace(`$`, ``).replace(`,`, ``),
    landlord_id: property.landlord_id,
    propType: property.propType.value,
    policies: property.policies,
    verified: property.verified,
  }).into(`properties`).returning(`id`);

  return newProperty[0];
};

exports.uploadImages = async ({ images, propertyId }) => {
  await Promise.all(images.map(async image => {
    image.key = uuidv4();
    await s3Upload({ file: image.buffer, imageKey: image.key, mimetype: image.mimetype });
    await knex.insert({
      property_id: propertyId,
      image_key: image.key,
    }).into(`property_images`);
  }));
};

exports.searchProperties = async ({ input }) => {
  const properties = await knex.raw(`
    SELECT *
    FROM properties
    WHERE LOWER(properties.street_1) || ', Unit ' || LOWER(properties.street_2) LIKE ?
  `, [ `%${ input }%` ]);

  return properties.rows;
};

exports.getPropertyThumbnail = async ({ property_id }) => {
  const propertyImageKey = await knex(`property_images`)
    .select(`image_key`)
    .where(`property_id`, property_id)
    .first();

  if (!propertyImageKey) {
    return null;
  }

  const propertyImage = await s3download(propertyImageKey.image_key);

  return propertyImage;

};
