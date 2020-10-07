

  import firebase from 'firebase';

  const firebaseApp = firebase.initializeApp({
      
  apiKey: "AIzaSyCvHAzf5rLYEOQLk2dXfi9MALevSyI897Y",
  authDomain: "hakkache-instagram.firebaseapp.com",
  databaseURL: "https://hakkache-instagram.firebaseio.com",
  projectId: "hakkache-instagram",
  storageBucket: "hakkache-instagram.appspot.com",
  messagingSenderId: "927662871737",
  appId: "1:927662871737:web:52ad4d99cc69d6fb123768",
  measurementId: "G-R7E0GVFH53"

  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export  { db, auth, storage};
