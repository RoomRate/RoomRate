
const { initializeApp, cert } = require(`firebase-admin/app`);
const { getAuth } = require(`firebase-admin/auth`);
const config = require(`config`);

const serviceAccountKey = config.get(`firebase`);

const app = initializeApp({
  credential: cert(serviceAccountKey),
});

exports.auth = getAuth(app);
