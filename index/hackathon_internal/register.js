// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC_dVjlg-7UZV_pzNM4ZGZk7HR1m1zPqo",
  authDomain: "aurahub-7dba8.firebaseapp.com",
  projectId: "aurahub-7dba8",
  storageBucket: "aurahub-7dba8.firebasestorage.app",
  messagingSenderId: "251347491629",
  appId: "1:251347491629:web:0da02e12febf774c3151a4",
  measurementId: "G-DMZ6SJ5M0R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;
const email = document.getElementById("email").value;

const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
  event.preventDefault();
});
