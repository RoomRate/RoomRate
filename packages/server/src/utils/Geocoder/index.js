const NodeGeocoder = require(`node-geocoder`);

const options = {
  provider: `google`,
  apiKey: `AIzaSyD57Cr3iJeGL2RlcokSm-v_T96C1NzW2Ts`,
};

const geocoder = NodeGeocoder(options);

exports.attachCoordinates = async ({ properties }) => {
  properties = await Promise.all(properties.map(async (p) => {
    const returned = await geocoder.geocode(p.street_1);
    p.lat = returned[0].latitude;
    p.lng = returned[0].longitude;

    return p;
  }));

  return properties;
};
