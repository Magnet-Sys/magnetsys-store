import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyADFxc3s6qYM1iKFtFcteYz20Ubzem2biE",
  authDomain: "magnetsys-store.firebaseapp.com",
  projectId: "magnetsys-store",
  storageBucket: "magnetsys-store.firebasestorage.app",
  messagingSenderId: "461475006148",
  appId: "1:461475006148:web:130415224268f311312b91"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };
export default firebase;
