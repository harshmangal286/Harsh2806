// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import {
  getDatabase,
  set,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUXP9wgzxYlXyj9qaIFUvzqj9r8gPQ-7Q",
  authDomain: "login-effa8.firebaseapp.com",
  databaseURL: "https://login-effa8-default-rtdb.firebaseio.com",
  projectId: "login-effa8",
  storageBucket: "login-effa8.appspot.com",
  messagingSenderId: "595077033852",
  appId: "1:595077033852:web:84c7439541ec3975047ef9",
  measurementId: "G-244PQGEYBC",
};

// Initialize Firebase
// Firebase SDK Import

// Firebase Configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const Database = getDatabase(app);
const auth = getAuth();

// Variables and Element Selection
let isSignUp = false;
const elements = {
  authMessage: document.getElementById("authMessage"),
  authTitle: document.getElementById("authTitle"),
  submitAuth: document.getElementById("submitAuth"),
  switchAuthMode: document.getElementById("switchAuthMode"),
  switchMessage: document.getElementById("switchMessage"),
  confirmPasswordGroup: document.getElementById("confirmPasswordGroup"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword"),
};

// Show messages
function showMessage(message, isError = false) {
  elements.authMessage.style.display = "block";
  elements.authMessage.innerHTML = message;
  elements.authMessage.style.opacity = 1;
  elements.authMessage.style.color = isError ? "red" : "green";
  setTimeout(() => {
    elements.authMessage.style.opacity = 0;
  }, 5000);
}

// Switch between Sign In and Sign Up
function switchAuthMode() {
  isSignUp = !isSignUp;
  elements.authTitle.textContent = isSignUp ? "Sign Up" : "Sign In";
  elements.submitAuth.textContent = isSignUp ? "Sign Up" : "Sign In";
  elements.switchAuthMode.textContent = isSignUp ? "Sign In" : "Sign Up";
  elements.switchMessage.textContent = isSignUp
    ? "Already have an account?"
    : "Don't have an account yet?";
  elements.confirmPasswordGroup.style.display = isSignUp ? "block" : "none";
}

// Input validation
function validateInput(email, password, confirmPassword) {
  if (!email || !password) {
    return "Please enter email and password";
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Please enter a valid email address";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  if (isSignUp && password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
}

// Handle Authentication (Sign In/Sign Up)
async function handleAuthSubmit(event) {
  event.preventDefault();
  const email = elements.email.value.trim();
  const password = elements.password.value;
  const confirmPassword = elements.confirmPassword.value;
  const error = validateInput(email, password, confirmPassword);
  if (error) {
    showMessage(error, true);
    return;
  }

  if (isSignUp) {
    // Sign-up logic
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        set(ref(Database, "users/" + user.uid), { email: email });
        showMessage("Account created successfully!");
      })
      .catch((error) => {
        showMessage(error.message, true);
      });
  } else {
    // Sign-in logic
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const dt = new Date();
        update(ref(Database, "users/" + user.uid), { lastlogin: dt });
        showMessage("Signed in successfully!");
        showMessage("Redirecting to")
        window.location.href = "main.html"; // Redirect to main page
      })
      .catch((error) => {
        showMessage(error.message, true);
      });
  }
}

// Event Listeners
document
  .getElementById("submitAuth")
  .addEventListener("click", handleAuthSubmit);
document
  .getElementById("switchAuthMode")
  .addEventListener("click", switchAuthMode);

// Monitor Authentication State
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, handle accordingly (e.g., display user info)
  }
});
