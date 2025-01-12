// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

// Event Listeners
submitButton.addEventListener("click", addSchedule);
emergencyButton.addEventListener("click", addEmergencySchedule);

// Functions
async function addScheduleData(scheduleData) {
  try {
    await addDoc(collection(db, "schedules"), scheduleData);
    alert("Schedule added successfully!");
    totalSurgeriesEl.textContent = Number(totalSurgeriesEl.textContent) + 1;
    loadSchedule();
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
    alert("Please fill in all fields");
    return;
  }

  await addScheduleData(scheduleData);
}

async function addEmergencySchedule(event) {
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
    anesthesiaType: document .getElementById("anesthesia-type").value,
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
    emergency: true,
  };

  // Validate the data
  if (!scheduleData.otId || !scheduleData.date) {
    alert("Please fill in all fields");
    return;
  }

  await addScheduleData(scheduleData);
  emergencySurgeriesEl.textContent = Number(emergencySurgeriesEl.textContent) + 1;
}

async function loadSchedule() {
}

  // Add event listeners to edit and delete buttons
  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const scheduleId = event.target.dataset.id;
      const scheduleDoc = await getDoc(doc(db, "schedules", scheduleId));
      const scheduleData = scheduleDoc.data();
      // Populate the schedule info form with the schedule data
      scheduleInfoForm.otId.value = scheduleData.otId;
      scheduleInfoForm.date.value = scheduleData.date;
      scheduleInfoForm.startTime.value = scheduleData.startTime;
      scheduleInfoForm.endTime.value = scheduleData.endTime;
      scheduleInfoForm.doctor.value = scheduleData.doctor;
      scheduleInfoForm.assistantSurgeon.value = scheduleData.assistantSurgeon;
      scheduleInfoForm.anesthesiologist.value = scheduleData.anesthesiologist;
      scheduleInfoForm.patientName.value = scheduleData.patientName;
      scheduleInfoForm.operationType.value = scheduleData.operationType;
      scheduleInfoForm.anesthesiaType.value = scheduleData.anesthesiaType;
      scheduleInfoForm.patientAge.value = scheduleData.patientAge;
      scheduleInfoForm.patientGender.value = scheduleData.patientGender;
      scheduleInfoForm.patientBloodGroup.value = scheduleData.patientBloodGroup;
      scheduleInfoForm.patientContact.value = scheduleData.patientContact;
      scheduleInfoForm.patientAllergies.value = scheduleData.patientAllergies;
      scheduleInfoForm.patientDiagnosis.value = scheduleData.patientDiagnosis;
      scheduleInfoForm.patientBedNo.value = scheduleData.patientBedNo;
      scheduleInfoForm.procedureType.value = scheduleData.procedureType;
      scheduleInfoForm.patientMedications .value = scheduleData.patientMedications;
      scheduleInfoForm.preOpEvents.value = scheduleData.preOpEvents;
      scheduleInfoForm.postOpEvents.value = scheduleData.postOpEvents;
      scheduleInfoForm.surgicalReports.value = scheduleData.surgicalReports;
      scheduleInfoForm.doctorRemarks.value = scheduleData.doctorRemarks;
      scheduleInfoForm.specialRequirements.value = scheduleData.specialRequirements;
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const scheduleId = event.target.dataset.id;
      await deleteDoc(doc(db, "schedules", scheduleId));
      loadSchedule();
    });
  });


loadSchedule();