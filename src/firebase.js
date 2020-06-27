import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDthpVdA1C2LEhFuMe95jOxeMLrcmwgdxw",
  authDomain: "study-checker-mg.firebaseapp.com",
  databaseURL: "https://study-checker-mg.firebaseio.com",
  projectId: "study-checker-mg",
  storageBucket: "study-checker-mg.appspot.com",
  messagingSenderId: "747641362713",
  appId: "1:747641362713:web:ccf6682b1bdaad35fc8d88",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage().ref();
export const str = firebase.storage();
