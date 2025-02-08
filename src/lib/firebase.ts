// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaaUw3Y6FrJHUz-d3dWStDBrTZOjSOo6I",
  authDomain: "sharedrop-9ea85.firebaseapp.com",
  databaseURL: "https://sharedrop-9ea85-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sharedrop-9ea85",
  storageBucket: "sharedrop-9ea85.firebasestorage.app",
  messagingSenderId: "947758186120",
  appId: "1:947758186120:web:7e591f78300345c922a93d",
  measurementId: "G-1128KQY3N6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default app;
export { db };
