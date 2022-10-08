// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/messaging';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBKkcVG_8oBWKYt6uXNUNNsFRl_q47S5-o",
  authDomain: "evernotereset-a4472.firebaseapp.com",
  projectId: "evernotereset-a4472",
  storageBucket: "evernotereset-a4472.appspot.com",
  messagingSenderId: "835631486734",
  appId: "1:835631486734:web:2bf8e0332795b33bb1695f",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.firestore();

export {firebase, database};

