// import { initializeApp } from "react/app";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYO1V8j01KKRV7XFdJ4m9MvDM59wtrk4Y",
  authDomain: "aviaxin.firebaseapp.com",
  projectId: "aviaxin",
  storageBucket: "aviaxin.appspot.com",
  messagingSenderId: "137019116488",
  appId: "1:137019116488:web:6e97ced366edca194b4efd",
  measurementId: "G-EXYP38T1FS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authD = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
