const firebase = require("firebase/app");
const admin = require("firebase-admin");
const { getAuth } = require("firebase/auth");

const config = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
  projectId: `${process.env.FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
  messagingSenderId: `${process.env.FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.FIREBASE_APP_ID}`,
};

// init app, admin and database
const app = firebase.initializeApp(config);
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  ),
});
const db = admin.firestore();

// init auth services
const appAuth = getAuth(app);
const adminAuth = admin.auth();

module.exports = { appAuth, adminAuth, db };
