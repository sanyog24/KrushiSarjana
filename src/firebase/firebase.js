import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore,collection,addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB6xpQ7pNGzPVf_-oo9-2Vjzc1bcIWKpoE",
    authDomain: "krushi-50fe2.firebaseapp.com",
    projectId: "krushi-50fe2",
    storageBucket: "krushi-50fe2.firebasestorage.app",
    messagingSenderId: "196199975855",
    appId: "1:196199975855:web:00b50c04bcb12e9bc1bd5a",
    measurementId: "G-DYNV95L4J1"
  };
  

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  export { auth, db,storage,collection,addDoc };