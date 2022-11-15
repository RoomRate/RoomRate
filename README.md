# Roomrate
https://room-rate.herokuapp.com/

Future IT Expo winner

# Requirements

- Nodejs v16.17.0 https://nodejs.org/en/download/

# Start Frontend
1. ``npm install`` (from the root of the project)
2. ``cd packages/client``
3. ``npm run start``

# Start Development Server
1. ``npm install`` (from the root of the project) if you haven't already
2. ``cd packages/server``
3. create dev.json file in config folder
4. ``npm run start:dev``

# When adding new config values
1. If it is on the server, make sure that you add an empty value for it in default.json (heroku doesn't like it if you don't)
2. Make sure that you add the config value to the project on heroku (https://dashboard.heroku.com/apps/room-rate/settings)
