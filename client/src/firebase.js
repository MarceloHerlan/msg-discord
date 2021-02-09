import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyC3JjZVZbumMf_V1CXVIl-CDnQmg8HwAAU",
    authDomain: "discord-1c037.firebaseapp.com",
    projectId: "discord-1c037",
    storageBucket: "discord-1c037.appspot.com",
    messagingSenderId: "377013952003",
    appId: "1:377013952003:web:347e935e793a0ab6ad3836"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db