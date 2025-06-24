const admin = require("firebase-admin");
// const serviceAccount = require("./service-account.json");
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
