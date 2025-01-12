// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaabCi83ItxJWjpwUvZ_PgN_Qt5g97I34",
  authDomain: "operation-scheduled.firebaseapp.com",
  databaseURL: "https://operation-scheduled-default-rtdb.firebaseio.com",
  projectId: "operation-scheduled",
  storageBucket: "operation-scheduled.appspot.com",
  messagingSenderId: "445639738751",
  appId: "1:445639738751:web:7f5cee34060ef82c78064a",
  measurementId: "G-X69B4LMZ90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
  const authMessageElement = elements.authMessage;
  authMessageElement.textContent = message;
  authMessageElement.style.backgroundColor = isError ? "red" : "green";
  authMessageElement.classList.add("visible");

  // Remove visibility after 5 seconds
  setTimeout(() => {
    authMessageElement.classList.remove("visible");
  }, 5000);
}

// Switch between Sign In and Sign Up
function switchAuthMode() {
  isSignUp = !isSignUp;
  elements.authTitle.textContent = isSignUp ? "Sign Up" : "Sign In";
  elements.submitAuth.textContent = isSignUp ? "Sign Up" : "Sign In";
  elements.switchAuthMode.textContent = isSignUp ? "Sign In" : "Sign Up";
  elements.switchMessage.textContent = isSignUp ? "Already have an account?" : "Don't have an account yet?";
  elements.confirmPasswordGroup.style.display = isSignUp ? "block" : "none";
}

// Input validation
function validateInput(email, password, confirmPassword) {
  if (!email || !password) return "Please enter email and password.";
  if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address.";
  if (password.length < 6) return "Password must be at least 6 characters long.";
  if (isSignUp && password !== confirmPassword) return "Passwords do not match.";
  return null;
}

// Handle Authentication State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        sessionStorage.setItem("userEmail", userDoc.data().email);
        window.location.href = "maintest.html";  // Redirect to the main page
      } else {
        await signOut(auth);
        showMessage("No account found for this user. Please sign up first.", true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      showMessage("An error occurred. Please try again.", true);
    }
  } else {
    showMessage("Please sign in to continue.", true);
  }
});

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

  try {
    if (isSignUp) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { email, createdAt: new Date().toISOString() });
      showMessage("Account created successfully! Please sign in to continue.");
      switchAuthMode();
    } else {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        await updateDoc(doc(db, "users", user.uid), { lastLogin: new Date().toISOString() });
        sessionStorage.setItem("userEmail", email);
        showMessage("Signed in successfully!");
        window.location.href = "maintest.html";  // Redirect to the main page
      } else {
        showMessage("No account found for this email. Please sign up first.", true);
        await signOut(auth);
      }
    }
  } catch (error) {
    showMessage(error.message, true);
  }
}
// Handle Sign Out
async function handleSignOut() {
    try {
      await signOut(auth);  // Firebase sign-out
      sessionStorage.removeItem("userEmail");  // Clear session storage
      showMessage("You have been logged out successfully.");
      window.location.href = "login.html";  // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
      showMessage("An error occurred while logging out.", true);
    }
  }
  
  // Event listener for logout button
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleSignOut);
  }
  
// Event Listeners for Auth
elements.submitAuth.addEventListener("click", handleAuthSubmit);
elements.switchAuthMode.addEventListener("click", switchAuthMode);

// Schedule Management Logic

// DOM Elements
const totalSurgeriesEl = document.getElementById("total-surgeries");
const emergencySurgeriesEl = document.getElementById("emergency-surgeries");
const availableOTsEl = document.getElementById("available-ots");
const scheduleForm = document.getElementById("new-schedule-form");
const scheduleInfoForm = document.getElementById("schedule-info");
const submitButton = document.getElementById("submit-schedule");
const emergencyButton = document.getElementById("emergency-schedule");
const emailElement = document.getElementById("userEmail");
const usernameElement = document.getElementById("userName");

// Function to add schedule data to Firestore
async function addScheduleData(scheduleData) {
  try {
    await addDoc(collection(db, "schedules"), scheduleData);
    alert("Schedule added successfully!");
    totalSurgeriesEl.textContent = Number(totalSurgeriesEl.textContent || 0) + 1;
    loadSchedule();  // Reload schedules after adding
  } catch (error) {
    console.error("Error adding schedule:", error);
    alert("Error adding schedule: " + error.message);
  }
}

// Function to handle schedule form submission
async function addSchedule(event) {
  event.preventDefault();
  const scheduleData = collectScheduleData();

  if (!scheduleData.otId || !scheduleData.date) {
    alert("Please fill in all required fields.");
    return;
  }

  await addScheduleData(scheduleData);
}

// Collecting schedule data from form
function collectScheduleData() {
  return {
    otId: document.getElementById("ot-id").value,
    date: document.getElementById("schedule-date").value,
    startTime: document.getElementById("start-time").value,
    endTime: document.getElementById("end-time").value,
    doctor: document.getElementById("doctors").value,
    assistantSurgeon: document.getElementById("assistant-surgeon").value,
    anesthesiologist: document.getElementById("anesthesiologist").value,
    patientName: document.getElementById("patient-name").value,
    operationType: document.getElementById("operation-type").value,
    anesthesiaType: document.getElementById("anesthesia-type").value,
    patientAge: document.getElementById("patient-age").value,
    patientGender: document.getElementById("patient-gender").value,
    patientBloodGroup: document.getElementById("patient-bloodgroup").value,
    patientContact: document.getElementById("patient-contact").value,
    patientAllergies: document.getElementById("patient-allergies").value,
    patientDiagnosis: document.getElementById("patient-Diagnosis").value,
    patientBedNo: document.getElementById("patient-bed_no").value,
    procedureType: document.getElementById("procedure-type").value,
    patientMedications: document.getElementById("patient-medications").value,
    preOpEvents: document.getElementById("preop-events").value,
    postOpEvents: document.getElementById("postop-events").value,
    critical: emergencyButton.checked,
  };
}

// Event listeners for adding schedule
scheduleForm.addEventListener("submit", addSchedule);
emergencyButton.addEventListener("click", addSchedule);

// Loading schedules from Firestore
async function loadSchedule() {
  try {
    const querySnapshot = await getDocs(collection(db, "schedules"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error loading schedules:", error);
  }
}
