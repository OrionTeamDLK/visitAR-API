const admin = require('firebase-admin')

//Destruct enviroment object
const {
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
} = process.env;

//Initialize Firebase admin
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: FIREBASE_PROJECT_ID,
    private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: FIREBASE_CLIENT_EMAIL
  }),
  databaseURL: FIREBASE_DATABASE_URL
});

//Export Admin App
module.exports = admin
