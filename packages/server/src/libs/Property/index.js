const { attachCoordinates } = require(`../../utils/Geocoder`);
const knex = require(`../Database`);
const { s3download, s3Upload } = require(`../../utils/S3`);
const { v4: uuidv4 } = require(`uuid`);
const moment = require(`moment`);

exports.getPropertyList = async () => {
  let properties = await knex.raw(`
    SELECT *
    FROM properties
  `);
  properties = await attachCoordinates({ properties: properties.rows });

  return properties;
};

exports.getPropertyDetail = async ({ id }) => {
  let property = await knex.raw(`
    SELECT *
    FROM properties
    JOIN users ON users.id = properties.landlord_id
    JOIN states ON states.id = properties.state_id
    WHERE properties.id = ?
  `, [ id ]);

  property = await attachCoordinates({ properties: property.rows });

  return property[0];
};

exports.getReviews = async ({ id }) => {
  const reviews = await knex.raw(`
    SELECT * 
    FROM property_reviews
    JOIN users ON property_reviews.user_id = users.id
    WHERE property_reviews.property_id = ?
    `, [ id ]);

  return reviews.rows;
};

exports.createReview = async ({ review }) => {
  await knex.insert({
    rating: review.rating,
    message: review.message,
    user_id: 13, // hardcoded value until user session is set up
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
    street_1: property.address,
    street_2: property.addressTwo,
    details: property.description,
    city: property.city,
    state_id: property.state.value,
    zip: property.zipCode,
    bed: property.bedrooms,
    bath: property.bathrooms,
    rate: property.monthlyRent,
    landlord_id: 14,
    internet: property.internet,
    campusWalk: property.campusWalk,
    petsAllowed: property.petsAllowed,
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
