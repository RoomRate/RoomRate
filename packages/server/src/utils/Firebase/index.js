/* eslint-disable max-len */

const { initializeApp, cert } = require(`firebase-admin/app`);
const { getAuth } = require(`firebase-admin/auth`);

const serviceAccountKey = {
  type: `service_account` || process.env.TYPE,
  project_id: `room-rate-66c98` || process.env.PROJECT_ID,
  private_key_id: `9c2fd050dea4c183e89c983cc3b64b52c26849ef` || process.env.PRIVATE_KEY_ID,
  private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4/vV0eM53o5Hh\nJ1zvce80GvP5q9g7c3WuMUa8eC9v9YGo7BDtTugDyWSNY+ozxBtMXT8mEf/NJgfh\noHPlqEHqLM9L7l4/wSH8Tb+TFN6Gh8WLQ15mG5b/5OxtZQB3PNBHIU7d7radgHnu\n6kiLXyZ0tW5pl1R0EyvoxcNllnctZ0e/X0UfzP+RER2Orh7vRDOylje7adsN2mtt\n86r3eD5xjs+nUk67qSj1S9UI9AGXbh5gh3bmuqV5EhdvPxyKK7JdkQSbK9zABQnS\nCC5PK90frjzC/OCLzmKnCppW4R8qHWCBvjqx6vNDLo6IpRNhhqqrVgNEEaHDIohr\ntgqDcDDVAgMBAAECggEAA28UHk/ZwUXDgPLqmjU6s/RmH/XNIzle71dR0VDHzKO5\nfum23LjQvLVBzRAUOlbDDPVUJUBDR8sTbWA9ln87jf278VRg4n0SxOyqiC/ke4nM\npGuhNnL/qAtXSiaMTipOUWuwW5VBRYYrfUBTDWc8PwFZJdOdyTPL5lu5Z0rWNn0C\ns43n+Wd8dyadq52793ts6cilBiPGFwn6Pxuq65O3WQnA1LllXAYgCYrecE+Y3NLy\naHqPePVac1ikYUHKU1Kbpk8pwlh7zqY/rB35Pl5FKlPMcQnoI+poauXKFiSpAVqn\nl9ApfUgVLNoHkM3oo39/pHJYg4oFJXS+hxfhJwbxFwKBgQDm5KbwpcHT/oXS+etm\nibBmrkfiivOIYinQXsLb/atCGs3zCxJEkZ3W1PtXPR2tVH6Y+lec7KiOrgURRxB6\ni6o/Tu8YgKH+HmjbBE+1l3YNwIvbxnR71wawsZt37w3/+GnHF6DQ5nAbOqGLE7pt\npkeEhwtfvdZacvmCw/xBDjpMHwKBgQDNHKuXpZztW9AJnJEk8Cy1Fn8x/GvAqjPc\nLCTppnAXpH1WkKDTC75/VeQebd5KEl03cmYnuvmyegMV9g/JN6dwjJ7AVJGfropV\nPLJl6qI7aXQT/+6GNBYDi4oS89IJ1N0sGQq5xhk1e4NZxaAp6EB8v88ecgWuv9JT\nBqdSXlukiwKBgFTnMaf+G9c7mbQp6HDtIquvXImmdMTq69tObTL+BZKqTp8XrCEA\ntty/tqiutZH+JwtTyxHOSHEm9oAS9LFLWFAtU2hcLLVIM2COJk1tI6EM86DeSgkb\n2b7xoGyqwCgnDaaDPsRyaDjrB2of2AboBRZrnjgXk5HxA2Udck3t0GwbAoGBALI2\nTOjv3k9lTHZtcLb1bwLQTyexODYoK/MK7++Kyy3fn39NHk8Ajz239QJzV4ZoOlHo\ntdWjYTyvQmscZk7gaj0iEPTvBbAGSO8SU7a1jMuuLksKPcahDtd5sDgTXNVp+9lK\n0MTk2BZeAJxJV4XR4+YACgdb7pAM3sOArnSkw19NAoGBAKkxk0Q2g7IRrID+UqxT\nLKcKBkXiT1xt5PvRzndQHDLU3OsNzFzmvv3tOPlHehDx5GSVdT/ifXG5sFciW5wC\ng7y60qKnIXiLGVrS6yjGYYOA0HyaIIJFZpcBUGN7saHhoIN+5DgxqXYo8JZLoMx2\naz5aHbLsxdH7QOMiYYHOS4hv\n-----END PRIVATE KEY-----\n` || process.env.PRIVATE_KEY.replace(/\\n/g, `\n`),
  client_email: `firebase-adminsdk-qihag@room-rate-66c98.iam.gserviceaccount.com` || process.env.CLIENT_EMAIL,
  client_id: `117154979124532171234` || process.env.CLIENT_ID,
  auth_uri: `https://accounts.google.com/o/oauth2/auth` || process.env.AUTH_URI,
  token_uri: `https://oauth2.googleapis.com/token` || process.env.TOKEN_URI,
  auth_provider_x509_cert_url: `https://www.googleapis.com/oauth2/v1/certs` || process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qihag%40room-rate-66c98.iam.gserviceaccount.com` || process.env.CLIENT_X509_CERT_URL,
};

const app = initializeApp({
  credential: cert(serviceAccountKey),
});

exports.auth = getAuth(app);
