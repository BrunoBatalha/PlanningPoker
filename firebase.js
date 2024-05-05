// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "planning-poker-48ad2.firebaseapp.com",
    databaseURL: "https://planning-poker-48ad2-default-rtdb.firebaseio.com",
    projectId: "planning-poker-48ad2",
    storageBucket: "planning-poker-48ad2.appspot.com",
    messagingSenderId: "625085293964",
    appId: "1:625085293964:web:6326e4b5918cad101722a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app }