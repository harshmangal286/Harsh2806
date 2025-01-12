// Initialize Firebase
const firebaseConfig = {
    // Your Firebase configuration here
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const totalSurgeriesEl = document.getElementById('total-surgeries');
const emergencySurgeriesEl = document.getElementById('emergency-surgeries');
const availableOTsEl = document.getElementById('available-ots');
const dateSelector = document.getElementById('selected-date');
const prevDateBtn = document.getElementById('prev-date');
const nextDateBtn = document.getElementById('next-date');
const otScheduleList = document.getElementById('ot-schedule-list');
const addSurgeryBtn = document.getElementById('add-surgery');
const surgeryModal = document.getElementById('surgery-modal');
const surgeryForm = document.getElementById('surgery-form');
const closeModal = document.querySelector('.close');

// Set current date
let currentDate = new Date();
dateSelector.value = currentDate.toISOString().split('T')[0];

// Event Listeners
dateSelector.addEventListener('change', loadSchedule);
prevDateBtn.addEventListener('click', () => changeDate(-1));
nextDateBtn.addEventListener('click', () => changeDate(1));
addSurgeryBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunction);
surgeryForm.addEventListener('submit', saveSurgery);

// Functions
function changeDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    dateSelector.value = currentDate.toISOString().split('T')[0];
    loadSchedule();
}

function openModal() {
    surgeryModal.style.display = 'block';
}

function closeModalFunction() {
    surgeryModal.style.display = 'none';
    surgeryForm.reset();
}

async function loadSchedule() {
    const selectedDate = dateSelector.value;
    const surgeries = await getSurgeries(selectedDate);
    displaySchedule(surgeries);
    updateDashboard(surgeries);
}

async function getSurgeries(date) {
    const snapshot = await db.collection('surgeries')
        .where('date', '==', date)
        .orderBy('time')
        .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

function displaySchedule(surgeries) {
    otScheduleList.innerHTML = '';
    surgeries.forEach(surgery => {
        const surgeryEl = document.createElement('div');
        surgeryEl.classList.add('surgery-item');
        surgeryEl.innerHTML = `
            <h3>OT ${surgery.otId} - ${surgery.time}</h3>
            <p><strong>Surgeon:</strong> ${surgery.surgeon}</p>
            <p><strong>Anesthesiologist:</strong> ${surgery.anesthesiologist}</p>
            <p><strong>Anesthesia Type:</strong> ${surgery.anesthesiaType}</p>
            <button onclick="editSurgery('${surgery.id}')">Edit</button>
            <button onclick="deleteSurgery('${surgery.id}')">Delete</button>
        `;
        otScheduleList.appendChild(surgeryEl);
    });
}

function updateDashboard(surgeries) {
    totalSurgeriesEl.textContent = surgeries.length;
    const emergencies = surgeries.filter(s => s.isEmergency).length;
    emergencySurgeriesEl.textContent = emergencies;
    // You would need to implement logic to determine available OTs
    availableOTsEl.textContent = '5'; // Placeholder value
}

async function saveSurgery(e) {
    e.preventDefault();
    const surgeryData = {
        date: document.getElementById('surgery-date').value,
        time: document.getElementById('surgery-time').value,
        otId: document.getElementById('ot-id').value,
        anesthesiaType: document.getElementById('anesthesia-type').value,
        anesthesiologist: document.getElementById('anesthesiologist').value,
        surgeon: document.getElementById('surgeon').value,
        assistantSurgeon: document.getElementById('assistant-surgeon').value,
        nurses: document.getElementById('nurses').value,
        preOpEvents: document.getElementById('pre-op-events').value,
        postOpEvents: document.getElementById('post-op-events').value,
        doctorRemarks: document.getElementById('doctor-remarks').value,
        specialRequirements: document.getElementById('special-requirements').value,
        isEmergency: false // Add a checkbox in the form for emergency surgeries
    };

    const surgeryId = document.getElementById('surgery-id').value;
    if (surgeryId) {
        await db.collection('surgeries').doc(surgeryId).update(surgeryData);
    } else {
        await db.collection('surgeries').add(surgeryData);
    }

    closeModalFunction();
    loadSchedule();
}

async function editSurgery(id) {
    const surgery = await db.collection('surgeries').doc(id).get();
    const data = surgery.data();
    document.getElementById('surgery-id').value = id;
    document.getElementById('surgery-date').value = data.date;
    document.getElementById('surgery-time').value = data.time;
    document.getElementById('ot-id').value = data.otId;
    document.getElementById('anesthesia-type').value = data.anesthesiaType;
    document.getElementById('anesthesiologist').value = data.anesthesiologist;
    document.getElementById('surgeon').value = data.surgeon;
    document.getElementById('assistant-surgeon').value = data.assistantSurgeon;
    document.getElementById('nurses').value = data.nurses;
    document.getElementById('pre-op-events').value = data.preOpEvents;
    document.getElementById('post-op-events').value = data.postOpEvents;
    document.getElementById('doctor-remarks').value = data.doctorRemarks;
    document.getElementById('special-requirements').value = data.specialRequirements;
    openModal();
}

async function deleteSurgery(id) {
    if (confirm('Are you sure you want to delete this surgery?')) {
        await db.collection('surgeries').doc(id).delete();
        loadSchedule();
    }
}

// Initial load
loadSchedule();