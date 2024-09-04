// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "madskillz-a6ba6.firebaseapp.com",
  projectId: "madskillz-a6ba6",
  storageBucket: "madskillz-a6ba6.appspot.com",
  messagingSenderId: "925355319788",
  appId: "1:925355319788:web:a55288510280ebdce860c9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
