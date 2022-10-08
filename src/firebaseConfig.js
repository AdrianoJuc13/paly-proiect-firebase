import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBKkcVG_8oBWKYt6uXNUNNsFRl_q47S5-o",
  authDomain: "evernotereset-a4472.firebaseapp.com",
  projectId: "evernotereset-a4472",
  storageBucket: "evernotereset-a4472.appspot.com",
  messagingSenderId: "835631486734",
  appId: "1:835631486734:web:2bf8e0332795b33bb1695f",
};

const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
