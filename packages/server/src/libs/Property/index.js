const NodeGeocoder = require(`node-geocoder`);

const options = {
  provider: `google`,
  apiKey: `AIzaSyD57Cr3iJeGL2RlcokSm-v_T96C1NzW2Ts`,
};

const geocoder = NodeGeocoder(options);

exports.getPropertyList = async () => {
  let properties = [];

  // query to fetch data from the database goes here

  const dummyData = [
    {
      id: 1,
      name: `Property 1`,
      description: `This is a property`,
      street1: `315 Terrace Ave`,
      street2: `Apt 2`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 2,
      name: `Property 2`,
      description: `This is a property`,
      street1: `404 Ludlow Ave`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 3,
      name: `Property 1`,
      description: `This is a property`,
      street1: `531 Lowell Ave`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 4,
      name: `Property 1`,
      description: `This is a property`,
      street1: `362 Probasco St`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 5,
      name: `Property 1`,
      description: `This is a property`,
      street1: `261 W McMillan St`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 6,
      name: `Property 1`,
      description: `This is a property`,
      street1: `108 Calhoun St`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 7,
      name: `Property 1`,
      description: `This is a property`,
      street1: `318 Terrace Ave`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 8,
      name: `Property 1`,
      description: `This is a property`,
      street1: `318 Terrace Ave`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 9,
      name: `Property 1`,
      description: `This is a property`,
      street1: `318 Terrace Ave`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 10,
      name: `Property 1`,
      description: `This is a property`,
      street1: `318 Terrace Ave`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 11,
      name: `Property 1`,
      description: `This is a property`,
      street1: `318 Terrace Ave`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 12,
      name: `Property 1`,
      description: `This is a property`,
      street1: `318 Terrace Ave`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
    {
      id: 13,
      name: `Property 1`,
      description: `This is a property`,
      street1: `318 Terrace Ave`,
      street2: `Apt 6`,
      city: `Cincinnati`,
      state: `OH`,
      zip: `45220`,
    },
  ];

  properties = await Promise.all(dummyData.map(async (p) => {
    const returned = await geocoder.geocode(`${ p.street1 }, ${ p.city }, ${ p.state }, ${ p.zip }`);
    p.lat = returned[0].latitude;
    p.lng = returned[0].longitude;

    return p;
  }));

  return properties;
};
