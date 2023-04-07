const NodeGeocoder = require(`node-geocoder`);
const config = require(`config`);
const geolib = require(`geolib`);

const options = {
  provider: `google`,
  apiKey: `AIzaSyD57Cr3iJeGL2RlcokSm-v_T96C1NzW2Ts`,
};

const geocoder = NodeGeocoder(options);

exports.attachCoordinates = async ({ property }) => {
  const returned = await geocoder.geocode(property.street_1);
  const [{ latitude }] = returned;
  const [{ longitude }] = returned;

  const distance = await geolib.getDistance(
    { latitude, longitude },
    config.get(`campus_coordinates`),
  );
  const distanceInMiles = (distance * 0.000621371).toFixed(2);

  return { latitude, longitude, distanceInMiles };
};
