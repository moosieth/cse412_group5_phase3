import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAYLS8Hf8NodT69r5TzP8H8Um4JA7NFDg",
    authDomain: "inql-group5.firebaseapp.com",
    projectId: "inql-group5",
    storageBucket: "inql-group5.appspot.com",
    messagingSenderId: "821165876719",
    appId: "1:821165876719:web:476d967bae4203f3a2821a",
    measurementId: "G-P1QJ576JS2"
  };

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
export { storage };
