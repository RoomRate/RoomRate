const NodeGeocoder = require(`node-geocoder`);
const config = require(`config`);
const geolib = require(`geolib`);

const options = {
  provider: config.get(`geocoder.provider`) || process.env.REACT_APP_GEOCODER_PROVIDER,
  apiKey: config.get(`geocoder.apiKey`) || process.env.REACT_APP_GOOGLE_API_KEY,
};

const geocoder = NodeGeocoder(options);

exports.attachCoordinates = async ({ property }) => {
  const returned = await geocoder.geocode(property.street_1);
  const [{ latitude }] = returned;
  const [{ longitude }] = returned;

  const distance = await geolib.getDistance(
    { latitude, longitude },
    config.get(`campus_coordinates`) || { latitude: 39.131402309297805, longitude: -84.51615684482724 },
  );
  const distanceInMiles = (distance * 0.000621371).toFixed(2);

  return { latitude, longitude, distanceInMiles };
};
