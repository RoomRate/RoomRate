import * as firebase from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: `AIzaSyCArojvCg1N2AQc_CVVauyYFVv4FwuAHDA` || process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `room-rate-66c98.firebaseapp.com` || `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `ec2-52-72-56-59.compute-1.amazonaws.com` || process.env.REACT_APP_DATABASE_URL,
  projectId: `room-rate-66c98` || process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `gs://room-rate-66c98.appspot.com` || `${process.env.REACT_APP_FIREBASE_BUCKET}`,
  messagingSenderId: `1085605708535` || process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: `AIzaSyCArojvCg1N2AQc_CVVauyYFVv4FwuAHDA` || process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = firebase.initializeApp(firebaseConfig);

const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence);

export { auth };