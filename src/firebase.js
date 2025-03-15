// src/firebase.js
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDl_S5NwkvefBxdbby-3QIpUhj80lMPbuY",
  authDomain: "comics-230dd.firebaseapp.com",
  databaseURL: "https://comics-230dd.firebaseio.com",
  projectId: "comics-230dd",
  storageBucket: "comics-230dd.appspot.com",
  messagingSenderId: "171613551142",
  appId: "1:171613551142:web:2adb7ba7d5d750840684e7",
  measurementId: "G-M71QCB9TLT"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();

export { auth };
