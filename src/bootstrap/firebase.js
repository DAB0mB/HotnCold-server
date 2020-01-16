import { provideFirebase } from '../providers';

const bootstrapFirebase = () => {
  const firebase = require('firebase-admin');

  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
    databaseURL: process.env.FIREBASE_DB_URL,
  });

  provideFirebase(firebase);
};

export default bootstrapFirebase;
