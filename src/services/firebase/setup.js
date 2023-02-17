import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
// import 'firebase/firebase-messaging'

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().useDeviceLanguage();

export const auth = firebase.auth();
export const db = firebase.firestore();
export const provider = new firebase.auth.GoogleAuthProvider();

export const userChange = (callback) => {
  auth.onAuthStateChanged((user) => {
      if(user && !user.isAnonymous){
          callback({
              id:user.uid,
              correo: user.email,
              nombre: user.displayName,
              image: user.photoURL,
          });
      }
  });
}


  