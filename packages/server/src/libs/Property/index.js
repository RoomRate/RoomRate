const { attachCoordinates } = require(`../../utils/Geocoder`);

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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
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
      bed: 2,
      bath: 1,
    },
  ];

  properties = await attachCoordinates({ properties: dummyData });

  return properties;
};

exports.getPropertyDetail = async ({ id }) => {
  const dummyData = [{
    id: 1,
    name: `Property 1`,
    description: `This is a property`,
    street1: `315 Terrace Ave`,
    street2: `Apt 2`,
    city: `Cincinnati`,
    state: `OH`,
    zip: `45220`,
    bed: 2,
    bath: 1,
    landlord: {
      id: 1,
      name: `Gaslight Property`,
    },
    details: `This building is located in the Gaslight District of Clifton with 
    easy access to UC & Children's Hospital shuttles. You'll live right at the edge 
    the Ludlow shopping district! Local shops included a grocery store, hardware store, 
    wine store, bars, restaurants including The Gaslight Bar & Grill, eclectic shops, 
    the Esquire Theatre and The Ludlow Garage. Short trip to Downtown Cincinnati, 
    University of Cincinnati, Cincinnati State, several hospitals, and highways.`,
  }];

  const property = await attachCoordinates({ properties: dummyData });

  return property[0];
};

exports.getReviews = ({ id }) => {
  let reviews = [];

  // query to fetch data from the database goes here

  const dummyReviews = [
    {
      id: 1,
      name: `Matt A.`,
      rating: 5,
      review: `Great property, friendly neighborhood, good rent rates`,
    },
    {
      id: 2,
      name: `John B.`,
      rating: 4,
      review: `Great Property. Monthly Rent is reasonable`,
    },
    {
      id: 3,
      name: `Jane C.`,
      rating: 3,
      review: `Ran into some issues but overall still a decent property`,
    },
  ];

  reviews = dummyReviews;

  return reviews;
};
