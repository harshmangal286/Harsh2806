// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaabCi83ItxJWjpwUvZ_PgN_Qt5g97I34",
  authDomain: "operation-scheduled.firebaseapp.com",
  databaseURL: "https://operation-scheduled-default-rtdb.firebaseio.com",
  projectId: "operation-scheduled",
  storageBucket: "operation-scheduled.appspot.com",
  messagingSenderId: "445639738751",
  appId: "1:445639738751:web:7f5cee34060ef82c78064a",
  measurementId: "G-X69B4LMZ90",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// DOM Elements
const totalSurgeriesEl = document.getElementById("total-surgeries");
const emergencySurgeriesEl = document.getElementById("emergency-surgeries");
const availableOTsEl = document.getElementById("available-ots");
const scheduleForm = document.getElementById("new-schedule-form");
const scheduleInfoForm = document.getElementById("schedule-info");
const submitButton = document.getElementById("submit-schedule");
const emergencyButton = document.getElementById("emergency-schedule");

// For displaying user info
const emailElement = document.getElementById("userEmail");
const usernameElement = document.getElementById("userName");

// Functions
async function addScheduleData(scheduleData) {
  try {
    await addDoc(collection(db, "schedules"), scheduleData);
    alert("Schedule added successfully!");
    totalSurgeriesEl.textContent = Number(totalSurgeriesEl.textContent || 0) + 1;
    loadSchedule(); // Reload schedules after adding
  } catch (error) {
    console.error("Error adding schedule:", error);
    alert("Error adding schedule: " + error.message);
  }
}

async function addSchedule(event) {
  event.preventDefault();

  const scheduleData = {
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
    preOpEvents: document.getElementById("pre-op-events").value,
    postOpEvents: document.getElementById("post-op-events").value,
    surgicalReports: document.getElementById("surgical-reports").value,
    doctorRemarks: document.getElementById("doctor-remarks").value,
    specialRequirements: document.getElementById("special-requirements").value,
  };

  // Validate the data
  if (!scheduleData.otId || !scheduleData.date) {
    alert("Please fill in all required fields.");
    return;
  }

  await addScheduleData(scheduleData);
}

async function addEmergencySchedule(event) {
  event.preventDefault();

  const scheduleData = {
    ...collectFormData(),
    emergency: true, // Mark as emergency
  };

  // Validate the data
  if (!scheduleData.otId || !scheduleData.date) {
    alert("Please fill in all required fields.");
    return;
  }

  await addScheduleData(scheduleData);
  emergencySurgeriesEl.textContent =
    Number(emergencySurgeriesEl.textContent || 0) + 1;
}

// Load Schedules
async function loadSchedule() {
  const schedulesContainer = document.getElementById("schedules-container");
  schedulesContainer.innerHTML = ""; // Clear previous schedules

  const querySnapshot = await getDocs(collection(db, "schedules"));
  querySnapshot.forEach((doc) => {
    const scheduleData = doc.data();
    const scheduleDiv = document.createElement("div");
    scheduleDiv.innerHTML = `
      <p>${JSON.stringify(scheduleData)}</p>
      <button class="edit-btn" data-id="${doc.id}">Edit</button>
    `;
    schedulesContainer.appendChild(scheduleDiv);
  });

  // Add event listeners to edit buttons
  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const scheduleId = event.target.dataset.id;
      const scheduleDoc = await getDoc(doc(db, "schedules", scheduleId));
      const scheduleData = scheduleDoc.data();

      // Populate the schedule info form with the schedule data
      Object.keys(scheduleData).forEach((key) => {
        if (scheduleInfoForm[key]) {
          scheduleInfoForm[key].value = scheduleData[key];
        }
      });
    });
  });
}

// Collect Form Data
function collectFormData() {
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
    preOpEvents: document.getElementById("pre-op-events").value,
    postOpEvents: document.getElementById("post-op-events").value,
    surgicalReports: document.getElementById("surgical-reports").value,
    doctorRemarks: document.getElementById("doctor-remarks").value,
    specialRequirements: document.getElementById("special-requirements").value,
  };
}

// Display Email and Username
function displayUserInfo() {
  const email = sessionStorage.getItem("userEmail");
  if (email) {
    emailElement.textContent = email;
    usernameElement.textContent = email.split("@")[0];
    showmessage(email.split("@")[0]);
  } else {
    alert("Unauthorized access. Please log in.");
    window.location.href = "logintest.html";
  }
}

// Greeting Message
function showmessage(username) {
  const messageElement = document.getElementById("welcomeMessage");
  messageElement.textContent = `Welcome back, ${username}!`;
}

// Handle Logout
async function handleLogout() {
  try {
    const auth = getAuth();
    await signOut(auth); // Sign out the user from Firebase
    // Clear session data
    sessionStorage.removeItem("userEmail");
    // Redirect to login page
    window.location.href = "logintest.html"; // Redirect to the login page
  } catch (error) {
    console.error("Error during logout:", error);
    alert("An error occurred while logging out. Please try again.");
  }
}

// Add event listener for the logout button
document.getElementById("logoutButton").addEventListener("click", handleLogout);

// Initializations
document.addEventListener("DOMContentLoaded", () => {
  displayUserInfo(); // Display user info when the page is loaded
  loadSchedule(); // Load schedules on page load
});

// Event listeners for schedule forms
scheduleForm.addEventListener("submit", addSchedule);
emergencyButton.addEventListener("click", addEmergencySchedule);

// Authentication Listener
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    sessionStorage.setItem("userEmail", user.email); // Store the email in session storage
    displayUserInfo(); // Display user info if authenticated
  } else {
    sessionStorage.removeItem("userEmail"); // Remove session data if not authenticated
    window.location.href = "logintest.html"; // Redirect to login page if user is not logged in
  }
});
