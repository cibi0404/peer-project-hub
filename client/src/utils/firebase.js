import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1CFyjMZNxV9FJttmSdXy-uNQoOdjCbHY",
  authDomain: "peer-project-hub-d29f8.firebaseapp.com",
  projectId: "peer-project-hub-d29f8",
  storageBucket: "peer-project-hub-d29f8.firebasestorage.app",
  messagingSenderId: "1082505027172",
  appId: "1:1082505027172:web:40b12cdb7d70cf9b7f0971",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
