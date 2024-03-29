const fs = require(`fs`);
const path = require(`path`);

const pathToRoutes = path.join(__dirname, `../../routes`);

const RouteLoader = ({ app }) => {
  const routes = fs.readdirSync(pathToRoutes);

  routes.forEach(route => {
    const routePath = path.resolve(`${ pathToRoutes }/${ route }`);
    const router = require(routePath);

    app.use(`/api/${ route.toLowerCase() }`, router);
  });
};

module.exports = RouteLoader;
