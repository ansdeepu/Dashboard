
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// IMPORTANT: Replace with your actual Firebase project configuration!
// You can find this in your Firebase project settings:
// Project settings > General > Your apps > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdBken5JDPnPsI5jZs38UwGRmQym9jsGY",
  authDomain: "gwd-kollam-dashboard.firebaseapp.com",
  projectId: "gwd-kollam-dashboard",
  storageBucket: "gwd-kollam-dashboard.firebasestorage.app",
  messagingSenderId: "873479268293",
  appId: "1:873479268293:web:8656fe9e8e62226e024dac"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };
