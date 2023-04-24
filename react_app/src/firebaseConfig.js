import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOlvTpGtzaEiaHF9i95pTWYyy8lXu62pA",
  authDomain: "group5-inql.firebaseapp.com",
  projectId: "group5-inql",
  storageBucket: "group5-inql.appspot.com",
  messagingSenderId: "132758797745",
  appId: "1:132758797745:web:a993bc7a80c594ca591190",
  measurementId: "G-EE9ML4TEFQ"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
export { storage };
