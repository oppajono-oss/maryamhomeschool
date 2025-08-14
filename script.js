// JavaScript for Study Progress Tracker

// --- DOM Elements ---
const timerDisplay = document.querySelector('.timer-display');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const durationInput = document.getElementById('duration');
const startTimerButton = document.getElementById('start-timer');
const stopTimerButton = document.getElementById('stop-timer');
const resetTimerButton = document.getElementById('reset-timer');
const subjectSelect = document.getElementById('subject');
const studyLogList = document.getElementById('study-log-list');
const moodEmojis = document.querySelectorAll('.mood-emoji');
const journalNotesTextarea = document.getElementById('journal-notes');
const saveJournalEntryButton = document.getElementById('save-journal-entry');
const journalHistoryList = document.getElementById('journal-history-list');
const streakDaysDisplay = document.getElementById('streak-days');
const miniProgressChartCanvas = document.getElementById('mini-progress-chart');

// --- New Elements for Session Completion and Report ---
const sessionCompletionInputDiv = document.getElementById('session-completion-input');
const sessionNotesTextarea = document.getElementById('session-notes');
const starRatingContainer = document.getElementById('star-rating');
const saveSessionDetailsButton = document.getElementById('save-session-details');
const dailyReportSection = document.getElementById('daily-report');
const reportDateMoodDiv = document.getElementById('report-date-mood');
const reportStudySessionsList = document.getElementById('report-study-sessions');

// --- Timer State ---
let timerInterval = null;
let timeLeft = 0;
let isTimerRunning = false;
let currentSubject = 'Other';
let currentSessionDuration = 0; // To store the duration of the current session

// --- Journal State ---
let currentMood = '';
let journalEntries = [];

// --- Gamification State ---
let dailyStreak = 0;
let lastStudyDate = null;

// --- Session Data ---
let completedSessions = []; // Array to store completed session details

// --- Local Storage Keys ---
const STORAGE_JOURNAL_KEY = 'studyTrackerJournal';
const STORAGE_STREAK_KEY = 'studyTrackerStreak';
const STORAGE_LAST_STUDY_DATE_KEY = 'studyTrackerLastStudyDate';
const STORAGE_STUDY_LOG_KEY = 'studyTrackerStudyLog'; // New key for study logs
const STORAGE_COMPLETED_SESSIONS_KEY = 'studyTrackerCompletedSessions'; // Key for completed sessions

// --- Study Log State ---
let studyLogEntries = [];
// --- Local Storage Keys ---
const STORAGE_JOURNAL_KEY = 'studyTrackerJournal';
const STORAGE_STREAK_KEY = 'studyTrackerStreak';
const STORAGE_LAST_STUDY_DATE_KEY = 'studyTrackerLastStudyDate';
const STORAGE_STUDY_LOG_KEY = 'studyTrackerStudyLog'; // New key for study logs
const STORAGE_COMPLETED_SESSIONS_KEY = 'studyTrackerCompletedSessions'; // Key for completed sessions

// --- Study Log State ---
let studyLogEntries = [];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadJournalEntries();
    loadStreak();
    loadStudyLog(); // Load study logs on initialization
    loadCompletedSessions(); // Load completed sessions
    updateStreakDisplay();
    setupEventListeners();
    // Initialize timer display
    updateTimerDisplay(0);
});

// --- Event Listeners Setup ---
function setupEventListeners() {
    startTimerButton.addEventListener('click', startTimer);
    stopTimerButton.addEventListener('click', stopTimer);
    resetTimerButton.addEventListener('click', resetTimer);
    subjectSelect.addEventListener('change', (e) => {
        currentSubject = e.target.value;
    });

    moodEmojis.forEach(emoji => {
        emoji.addEventListener('click', handleMoodSelection);
    });

    saveJournalEntryButton.addEventListener('click', saveJournalEntry);

    // Add event listeners for new elements
    saveSessionDetailsButton.addEventListener('click', saveSessionDetails);
    setupStarRatingListeners(); // Function to set up listeners for star rating buttons

// Navigation scroll behavior
    document.querySelectorAll('.bottom-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });

                // Update active navigation item
                document.querySelectorAll('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Make planner subjects clickable
    document.querySelectorAll('.day-column li').forEach(subjectItem => {
        subjectItem.addEventListener('click', handleSubjectClick);
    });
}

// --- Timer Functions ---
function startTimer() {
    if (isTimerRunning) return;

    const durationMinutes = parseInt(durationInput.value, 10);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
        alert('Please enter a valid duration.');
        return;
    }

    currentSessionDuration = durationMinutes; // Store duration for later use
    timeLeft = durationMinutes * 60;
    isTimerRunning = true;
    updateTimerDisplay(timeLeft);

    // Hide timer controls and show completion input when timer starts
    document.querySelector('.timer-controls').style.display = 'none';
    document.querySelector('.study-log').style.display = 'none'; // Hide study log as well

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            stopTimer();
            handleTimerEnd();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
}

function resetTimer() {
    stopTimer();
    timeLeft = parseInt(durationInput.value, 10) * 60;
    updateTimerDisplay(timeLeft);
    // Ensure controls are visible if reset is pressed before timer ends
    document.querySelector('.timer-controls').style.display = '';
    document.querySelector('.study-log').style.display = '';
    sessionCompletionInputDiv.style.display = 'none'; // Hide completion input if reset
}

function updateTimerDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function handleTimerEnd() {
    // const duration = parseInt(durationInput.value, 10); // Already stored in currentSessionDuration
    logStudySession(currentSubject, currentSessionDuration); // Log the session
    updateStreak();
    checkAndAwardRewards(); // Check for rewards after a session ends

    // Show the session completion input section
    sessionCompletionInputDiv.style.display = 'block';
    // Potentially trigger a notification here
}

function logStudySession(subject, duration) {
    const logEntry = {
        timestamp: new Date().toLocaleString(),
        subject: subject,
        duration: duration
    };
    studyLogList.prepend(createLogEntryElement(logEntry)); // Add to the top of the list
    studyLogEntries.push(logEntry); // Add to our in-memory array
    saveStudyLog(); // Save log to local storage
    updateProgressChart(); // Update chart after logging a session
}

function createLogEntryElement(logEntry) {
    const li = document.createElement('li');
    li.textContent = `${logEntry.timestamp} - ${logEntry.subject}: ${logEntry.duration} minutes`;
    return li;
}

function saveStudyLog() {
    localStorage.setItem(STORAGE_STUDY_LOG_KEY, JSON.stringify(studyLogEntries));
}

function loadStudyLog() {
    const storedLogs = localStorage.getItem(STORAGE_STUDY_LOG_KEY);
    if (storedLogs) {
        studyLogEntries = JSON.parse(storedLogs);
        // Display existing logs
        studyLogEntries.forEach(entry => {
            studyLogList.prepend(createLogEntryElement(entry));
        });
    }
}

// --- Journal Functions ---
function handleMoodSelection(e) {
    moodEmojis.forEach(emoji => emoji.classList.remove('selected'));
    e.target.classList.add('selected');
    currentMood = e.target.dataset.mood;
}

function saveJournalEntry() {
    const notes = journalNotesTextarea.value.trim();
    if (!currentMood && !notes) {
        alert('Please select a mood or add some notes.');
        return;
    }

    const entry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        mood: currentMood,
        notes: notes
    };

    journalEntries.push(entry);
    saveJournalEntries();
    displayJournalEntry(entry);

    // Reset form
    moodEmojis.forEach(emoji => emoji.classList.remove('selected'));
    journalNotesTextarea.value = '';
    currentMood = '';
}

function displayJournalEntry(entry) {
    const entryElement = document.createElement('li');
    entryElement.innerHTML = `
        <p><strong>${entry.timestamp}</strong></p>
        <p>
            ${entry.mood ? `<span class="mood">${getMoodEmoji(entry.mood)}</span>` : ''}
            ${entry.notes ? `<span class="notes">${entry.notes}</span>` : ''}
        </p>
    `;
    journalHistoryList.prepend(entryElement);
}

function getMoodEmoji(mood) {
    switch (mood) {
        case 'happy': return '😊';
        case 'neutral': return '😐';
        case 'sad': return '😔';
        default: return '';
    }
}

function saveJournalEntries() {
    localStorage.setItem(STORAGE_JOURNAL_KEY, JSON.stringify(journalEntries));
}

function loadJournalEntries() {
    const storedEntries = localStorage.getItem(STORAGE_JOURNAL_KEY);
    if (storedEntries) {
        journalEntries = JSON.parse(storedEntries);
        journalEntries.forEach(displayJournalEntry);
    }
}

// --- Gamification Functions ---
function updateStreak() {
    const today = new Date().toDateString();
    if (lastStudyDate === today) {
        // Already studied today, streak continues
    } else {
        const lastDate = new Date(lastStudyDate);
        const todayDate = new Date(today);

        // Check if the last study date was yesterday
        if (lastStudyDate && (todayDate.getTime() - lastDate.getTime() === 24 * 60 * 60 * 1000)) {
            dailyStreak++;
        } else {
            dailyStreak = 1; // Start a new streak
        }
        lastStudyDate = today;
    }
    saveStreak();
    updateStreakDisplay();
}

function saveStreak() {
    localStorage.setItem(STORAGE_STREAK_KEY, dailyStreak);
    localStorage.setItem(STORAGE_LAST_STUDY_DATE_KEY, lastStudyDate);
}

function loadStreak() {
    const storedStreak = localStorage.getItem(STORAGE_STREAK_KEY);
    const storedLastStudyDate = localStorage.getItem(STORAGE_LAST_STUDY_DATE_KEY);
    if (storedStreak) {
        dailyStreak = parseInt(storedStreak, 10);
    }
    if (storedLastStudyDate) {
        lastStudyDate = storedLastStudyDate;
    }
}

function updateStreakDisplay() {
    if (streakDaysDisplay) {
        streakDaysDisplay.textContent = `${dailyStreak} days`;
    }
}

// --- Placeholder for other features ---
// Parent View, Export/Import JSON, PWA, Focus Mode, etc.
// These will be implemented as needed.

// --- Focus Mode ---
let isFocusMode = false;
const focusModeButton = document.createElement('button'); // Placeholder, will add to DOM later
focusModeButton.textContent = 'Focus Mode';
// Add styling and event listener for focusModeButton

function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    if (isFocusMode) {
        activateFocusMode();
    } else {
        deactivateFocusMode();
    }
}

function activateFocusMode() {
    document.body.classList.add('focus-mode');
    // Hide elements not needed in focus mode
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    document.querySelector('.planner').style.display = 'none';
    document.querySelector('.journal').style.display = 'none';
    document.querySelector('.gamification').style.display = 'none';
    document.querySelector('.study-log').style.display = 'none'; // Hide study log within timer section

    // Make timer controls larger and simpler
    document.querySelector('.timer-controls').classList.add('focus-mode-timer');
    document.querySelector('.timer-display').style.fontSize = '60px';
    document.querySelector('.timer-options').style.flexDirection = 'column';
    document.querySelector('.timer-options button').style.padding = '15px 30px';
    document.querySelector('.timer-options input').style.width = '80px';
    document.querySelector('.subject-selection').style.display = 'none'; // Hide subject selection

    // Add a button to exit focus mode
    const exitFocusButton = document.createElement('button');
    exitFocusButton.textContent = 'Exit Focus Mode';
    exitFocusButton.style.marginTop = '20px';
    exitFocusButton.style.padding = '10px 20px';
    exitFocusButton.style.backgroundColor = '#f44336'; // Red color for exit
    exitFocusButton.style.color = 'white';
    exitFocusButton.style.border = 'none';
    exitFocusButton.style.borderRadius = '12px';
    exitFocusButton.style.cursor = 'pointer';
    exitFocusButton.addEventListener('click', deactivateFocusMode);
    document.querySelector('.timer-controls').appendChild(exitFocusButton);
}

function deactivateFocusMode() {
    document.body.classList.remove('focus-mode');
    // Show elements again
    document.querySelector('header').style.display = '';
    document.querySelector('footer').style.display = '';
    document.querySelector('.planner').style.display = '';
    document.querySelector('.journal').style.display = '';
    document.querySelector('.gamification').style.display = '';
    document.querySelector('.study-log').style.display = '';

    document.querySelector('.timer-controls').classList.remove('focus-mode-timer');
    document.querySelector('.timer-display').style.fontSize = '';
    document.querySelector('.timer-options').style.flexDirection = '';
    document.querySelector('.timer-options button').style.padding = '';
    document.querySelector('.timer-options input').style.width = '';
    document.querySelector('.subject-selection').style.display = '';

    // Remove the exit focus button
    const exitFocusButton = document.querySelector('.timer-controls button[textContent="Exit Focus Mode"]');
    if (exitFocusButton) {
        exitFocusButton.remove();
    }
    isFocusMode = false;
}

// Add a button for Focus Mode to the header or settings
// For now, let's add it to the header for testing
const header = document.querySelector('header');
const focusModeToggle = document.createElement('button');
focusModeToggle.textContent = 'Focus';
focusModeToggle.style.marginLeft = '10px';
focusModeToggle.style.padding = '5px 10px';
focusModeToggle.style.border = 'none';
focusModeToggle.style.borderRadius = '5px';
focusModeToggle.style.cursor = 'pointer';
focusModeToggle.addEventListener('click', toggleFocusMode);
header.appendChild(focusModeToggle);

// --- Parent View ---
function openParentView() {
    // This is a placeholder for the parent view functionality.
    // It would typically involve displaying a summary of the child's progress.
    alert("Opening Parent View. This feature is still under development.");
    // Example: Display total study hours, streak, recent journal entries, etc.
    // Could also include a print PDF button.
}

// Add a button for Parent View to the header or settings
const parentViewButton = document.createElement('button');
parentViewButton.textContent = 'Parent View';
parentViewButton.style.marginLeft = '10px';
parentViewButton.style.padding = '5px 10px';
parentViewButton.style.border = 'none';
parentViewButton.style.borderRadius = '5px';
parentViewButton.style.cursor = 'pointer';
parentViewButton.addEventListener('click', openParentView);
header.appendChild(parentViewButton);


// --- Gamification Rewards ---
const REWARD_CRITERIA = {
    FIRST_SESSION: { name: "First Study Session", condition: () => studyLogEntries.length >= 1 },
    THREE_DAY_STREAK: { name: "3-Day Streak", condition: () => dailyStreak >= 3 },
    TEN_HOURS_STUDY: { name: "10 Hours Studied", condition: () => calculateTotalStudyHours() >= 10 },
    FIVE_SESSIONS: { name: "5 Study Sessions", condition: () => studyLogEntries.length >= 5 },
    COMPLETED_SUBJECT: { name: "Completed a Subject", condition: () => hasCompletedSubject() }
};

const earnedRewards = [];
const studiedSubjects = new Set(); // To track subjects studied

function calculateTotalStudyHours() {
    return studyLogEntries.reduce((total, entry) => total + entry.duration, 0) / 60; // duration is in minutes
}

function hasCompletedSubject() {
    // A subject is considered completed if it has been studied at least once.
    // This is a basic implementation; could be expanded to require a certain duration or number of sessions.
    return studiedSubjects.size > 0;
}

function checkAndAwardRewards() {
    // Ensure rewards are checked on load as well
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', awardRewardsOnLoad);
    } else {
        awardRewardsOnLoad();
    }

    for (const rewardKey in REWARD_CRITERIA) {
        const reward = REWARD_CRITERIA[rewardKey];
        if (reward.condition() && !earnedRewards.includes(reward.name)) {
            earnedRewards.push(reward.name);
            displayReward(reward.name);
        }
    }
}

function awardRewardsOnLoad() {
    // Check rewards when the page loads
    checkAndAwardRewards();
}

function displayReward(rewardName) {
    const rewardsList = document.querySelector('.rewards-list');
    const rewardItem = document.createElement('div');
    rewardItem.classList.add('reward-item');

    let icon = '';
    switch(rewardName) {
        case "First Study Session": icon = "⭐"; break;
        case "3-Day Streak": icon = "🔥"; break;
        case "10 Hours Studied": icon = "📚"; break;
        case "5 Study Sessions": icon = "🚀"; break; // New icon for 5 sessions
        case "Completed a Subject": icon = "🏆"; break;
        default: icon = "💡";
    }

    rewardItem.innerHTML = `
        <span class="reward-icon">${icon}</span>
        <p>${rewardName}</p>
    `;
    rewardsList.appendChild(rewardItem);
}

// Update handleTimerEnd to check for rewards
function handleTimerEnd() {
    // const duration = parseInt(durationInput.value, 10); // Already stored in currentSessionDuration
    logStudySession(currentSubject, currentSessionDuration);
    updateStreak();
    checkAndAwardRewards(); // Check for rewards after a session ends

    // Show the session completion input section
    sessionCompletionInputDiv.style.display = 'block';
    // Hide the timer controls and study log
    document.querySelector('.timer-controls').style.display = 'none';
    document.querySelector('.study-log').style.display = 'none';
    // Potentially trigger a notification here
}

// --- Chart Initialization (already in HTML, but good to have a reference) ---
const ctx = miniProgressChartCanvas.getContext('2d');
const miniProgressChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Study Hours',
            data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros
            backgroundColor: [
                'rgba(76, 175, 80, 0.6)', // Primary color
                'rgba(255, 193, 7, 0.6)', // Secondary color
                'rgba(76, 175, 80, 0.6)',
                'rgba(255, 193, 7, 0.6)',
                'rgba(76, 175, 80, 0.6)',
                'rgba(255, 193, 7, 0.6)',
                'rgba(220, 220, 220, 0.6)' // Neutral for no study
            ],
            borderColor: [
                'rgba(76, 175, 80, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(220, 220, 220, 1)'
            ],
            borderWidth: 1,
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Function to update the chart with study log data
function updateProgressChart() {
    const dailyHours = {
        0: 0, // Sunday
        1: 0, // Monday
        2: 0, // Tuesday
        3: 0, // Wednesday
        4: 0, // Thursday
        5: 0, // Friday
        6: 0  // Saturday
    };

    studyLogEntries.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
        dailyHours[dayOfWeek] += entry.duration;
    });

    // Update chart data
    miniProgressChart.data.datasets[0].data = [
        dailyHours[1], // Monday
        dailyHours[2], // Tuesday
        dailyHours[3], // Wednesday
        dailyHours[4], // Thursday
        dailyHours[5], // Friday
        dailyHours[6], // Saturday
        dailyHours[0]  // Sunday
    ];
    miniProgressChart.update();
}

// Call updateProgressChart after loading logs and after each new log entry
document.addEventListener('DOMContentLoaded', () => {
    loadJournalEntries();
    loadStreak();
    loadStudyLog();
    loadCompletedSessions(); // Load completed sessions on DOMContentLoaded
    updateStreakDisplay();
    setupEventListeners();
    updateProgressChart(); // Update chart on load
    updateTimerDisplay(0);
});

// Modify logStudySession to also call updateProgressChart
// function logStudySession(subject, duration) { ... } // Already modified above

// --- Planner Functions ---
function handleSubjectClick(event) {
    const clickedSubject = event.target.textContent;
    currentSubject = clickedSubject;
    subjectSelect.value = clickedSubject; // Update the dropdown

    // Scroll to the timer section
    const timerSection = document.querySelector('.timer-tracker');
    if (timerSection) {
        timerSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- Session Completion Functions ---

// Function to set up event listeners for star rating buttons
function setupStarRatingListeners() {
    const stars = starRatingContainer.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', handleStarClick);
    });
}

// Handler for star clicks
let selectedRating = 0;
function handleStarClick(event) {
    const rating = parseInt(event.target.dataset.rating, 10);
    selectedRating = rating;

    // Highlight selected stars
    const stars = starRatingContainer.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

// Function to save the session details (notes and rating)
function saveSessionDetails() {
    const notes = sessionNotesTextarea.value.trim();
    if (selectedRating === 0 && !notes) {
        alert('Please enter notes or select a rating.');
        return;
    }

    const sessionData = {
        subject: currentSubject,
        duration: currentSessionDuration,
        notes: notes,
        rating: selectedRating,
        timestamp: new Date().toLocaleString()
    };

    completedSessions.push(sessionData);
    saveCompletedSessions();
    displaySessionInReport(sessionData); // Add to the report immediately

    // Reset UI elements
    sessionCompletionInputDiv.style.display = 'none';
    document.querySelector('.timer-controls').style.display = '';
    document.querySelector('.study-log').style.display = '';
    resetFormFields();
    updateProgressChart(); // Update chart if duration is used for it
}

// Function to save completed sessions to local storage
function saveCompletedSessions() {
    localStorage.setItem(STORAGE_COMPLETED_SESSIONS_KEY, JSON.stringify(completedSessions));
}

// Function to load completed sessions from local storage
function loadCompletedSessions() {
    const storedSessions = localStorage.getItem(STORAGE_COMPLETED_SESSIONS_KEY);
    if (storedSessions) {
        completedSessions = JSON.parse(storedSessions);
        // Display existing sessions in the report
        completedSessions.forEach(session => {
            // Only display sessions for the current day in the report
            const sessionDate = new Date(session.timestamp).toDateString();
            const todayDate = new Date().toDateString();
            if (sessionDate === todayDate) {
                displaySessionInReport(session);
            }
        });
    }
}

// Function to display a single completed session in the daily report
function displaySessionInReport(session) {
    const sessionItem = document.createElement('li');
    sessionItem.innerHTML = `
        <p><strong>${session.subject}</strong> (${session.duration} min)</p>
        <p>${session.notes || 'No notes'}</p>
        <p>Rating: ${getStarRating(session.rating)}</p>
    `;
    reportStudySessionsList.prepend(sessionItem);
}

// Helper to get star rating HTML
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '⭐' : '☆';
    }
    return stars;
}

// Function to reset the session completion form fields
function resetFormFields() {
    sessionNotesTextarea.value = '';
    selectedRating = 0;
    const stars = starRatingContainer.querySelectorAll('.star');
    stars.forEach(star => star.classList.remove('selected'));
}

// Function to generate and display the daily report
function generateDailyReport() {
    // Get current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('id-ID', options); // Use Indonesian locale for date format

    // Get current mood (from journal section)
    // We need to ensure currentMood is correctly set and accessible.
    // If no mood is selected, we can display a default or indicate it.
    const moodEmoji = currentMood ? getMoodEmoji(currentMood) : '❓';

    // Clear previous report entries for the day
    reportStudySessionsList.innerHTML = '';

    // Populate report date and mood
    reportDateMoodDiv.innerHTML = `
        <p><strong>Tanggal:</strong> ${formattedDate}</p>
        <p><strong>Mood Harian:</strong> ${moodEmoji}</p>
    `;

    // Filter completed sessions for today and display them
    const todaySessions = completedSessions.filter(session => {
        const sessionDate = new Date(session.timestamp).toDateString();
        return sessionDate === today.toDateString();
    });

    if (todaySessions.length === 0) {
        reportStudySessionsList.innerHTML = '<li>Belum ada sesi belajar hari ini.</li>';
    } else {
        todaySessions.forEach(session => {
            displaySessionInReport(session);
        });
    }
}

// Add event listener to a button that triggers report generation (e.g., a "View Report" button)
// For now, let's assume it's called when the page loads or when a new session is saved.
// We might need a dedicated button to view the report.
// Let's add a button to trigger it for now, or call it on DOMContentLoaded if appropriate.

// Add a button to view the report
const viewReportButton = document.createElement('button');
viewReportButton.textContent = 'Lihat Laporan Harian';
viewReportButton.style.marginTop = '20px';
viewReportButton.style.padding = '10px 20px';
viewReportButton.style.backgroundColor = '#4CAF50'; // Green color
viewReportButton.style.color = 'white';
viewReportButton.style.border = 'none';
viewReportButton.style.borderRadius = '5px';
viewReportButton.style.cursor = 'pointer';
viewReportButton.addEventListener('click', () => {
    generateDailyReport();
    // Optionally scroll to the report section
    dailyReportSection.scrollIntoView({ behavior: 'smooth' });
});
// Append this button somewhere logical, e.g., near the timer controls or after the journal section.
// For now, let's append it after the timer section, before the journal.
document.querySelector('.timer-tracker').insertAdjacentElement('afterend', viewReportButton);


// Ensure the initial load of completed sessions also populates the report if they are for today.
// This is handled in loadCompletedSessions.

// --- Chart Initialization (already in HTML, but good to have a reference) ---
// const ctx = miniProgressChartCanvas.getContext('2d');
// const miniProgressChart = new Chart(ctx, { ... }); // Chart initialization remains the same

// Function to update the chart with study log data
// function updateProgressChart() { ... } // Already modified above

// Call updateProgressChart after loading logs and after each new log entry
// document.addEventListener('DOMContentLoaded', () => { ... }); // Already modified above

// Modify logStudySession to also call updateProgressChart
// function logStudySession(subject, duration) { ... } // Already modified above

// --- Planner Functions ---
// function handleSubjectClick(event) { ... } // Already modified above

// --- Local Storage Keys ---
const STORAGE_JOURNAL_KEY = 'studyTrackerJournal';
const STORAGE_STREAK_KEY = 'studyTrackerStreak';
const STORAGE_LAST_STUDY_DATE_KEY = 'studyTrackerLastStudyDate';
const STORAGE_STUDY_LOG_KEY = 'studyTrackerStudyLog'; // New key for study logs

// --- Study Log State ---
let studyLogEntries = [];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadJournalEntries();
    loadStreak();
    loadStudyLog(); // Load study logs on initialization
    updateStreakDisplay();
    setupEventListeners();
    // Initialize timer display
    updateTimerDisplay(0);
});

// --- Event Listeners Setup ---
function setupEventListeners() {
    startTimerButton.addEventListener('click', startTimer);
    stopTimerButton.addEventListener('click', stopTimer);
    resetTimerButton.addEventListener('click', resetTimer);
    subjectSelect.addEventListener('change', (e) => {
        currentSubject = e.target.value;
    });

    moodEmojis.forEach(emoji => {
        emoji.addEventListener('click', handleMoodSelection);
    });

    saveJournalEntryButton.addEventListener('click', saveJournalEntry);

// Navigation scroll behavior
    document.querySelectorAll('.bottom-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });

                // Update active navigation item
                document.querySelectorAll('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Make planner subjects clickable
    document.querySelectorAll('.day-column li').forEach(subjectItem => {
        subjectItem.addEventListener('click', handleSubjectClick);
    });
}

// --- Timer Functions ---
function startTimer() {
    if (isTimerRunning) return;

    const durationMinutes = parseInt(durationInput.value, 10);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
        alert('Please enter a valid duration.');
        return;
    }

    timeLeft = durationMinutes * 60;
    isTimerRunning = true;
    updateTimerDisplay(timeLeft);

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            stopTimer();
            handleTimerEnd();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
}

function resetTimer() {
    stopTimer();
    timeLeft = parseInt(durationInput.value, 10) * 60;
    updateTimerDisplay(timeLeft);
}

function updateTimerDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function handleTimerEnd() {
    const duration = parseInt(durationInput.value, 10);
    logStudySession(currentSubject, duration);
    updateStreak();
    // Potentially trigger a notification here
}

function logStudySession(subject, duration) {
    const logEntry = {
        timestamp: new Date().toLocaleString(),
        subject: subject,
        duration: duration
    };
    studyLogList.prepend(createLogEntryElement(logEntry)); // Add to the top of the list
    studyLogEntries.push(logEntry); // Add to our in-memory array
    saveStudyLog(); // Save log to local storage
}

function createLogEntryElement(logEntry) {
    const li = document.createElement('li');
    li.textContent = `${logEntry.timestamp} - ${logEntry.subject}: ${logEntry.duration} minutes`;
    return li;
}

function saveStudyLog() {
    localStorage.setItem(STORAGE_STUDY_LOG_KEY, JSON.stringify(studyLogEntries));
}

function loadStudyLog() {
    const storedLogs = localStorage.getItem(STORAGE_STUDY_LOG_KEY);
    if (storedLogs) {
        studyLogEntries = JSON.parse(storedLogs);
        // Display existing logs
        studyLogEntries.forEach(entry => {
            studyLogList.prepend(createLogEntryElement(entry));
        });
    }
}

// --- Journal Functions ---
function handleMoodSelection(e) {
    moodEmojis.forEach(emoji => emoji.classList.remove('selected'));
    e.target.classList.add('selected');
    currentMood = e.target.dataset.mood;
}

function saveJournalEntry() {
    const notes = journalNotesTextarea.value.trim();
    if (!currentMood && !notes) {
        alert('Please select a mood or add some notes.');
        return;
    }

    const entry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        mood: currentMood,
        notes: notes
    };

    journalEntries.push(entry);
    saveJournalEntries();
    displayJournalEntry(entry);

    // Reset form
    moodEmojis.forEach(emoji => emoji.classList.remove('selected'));
    journalNotesTextarea.value = '';
    currentMood = '';
}

function displayJournalEntry(entry) {
    const entryElement = document.createElement('li');
    entryElement.innerHTML = `
        <p><strong>${entry.timestamp}</strong></p>
        <p>
            ${entry.mood ? `<span class="mood">${getMoodEmoji(entry.mood)}</span>` : ''}
            ${entry.notes ? `<span class="notes">${entry.notes}</span>` : ''}
        </p>
    `;
    journalHistoryList.prepend(entryElement);
}

function getMoodEmoji(mood) {
    switch (mood) {
        case 'happy': return '😊';
        case 'neutral': return '😐';
        case 'sad': return '😔';
        default: return '';
    }
}

function saveJournalEntries() {
    localStorage.setItem(STORAGE_JOURNAL_KEY, JSON.stringify(journalEntries));
}

function loadJournalEntries() {
    const storedEntries = localStorage.getItem(STORAGE_JOURNAL_KEY);
    if (storedEntries) {
        journalEntries = JSON.parse(storedEntries);
        journalEntries.forEach(displayJournalEntry);
    }
}

// --- Gamification Functions ---
function updateStreak() {
    const today = new Date().toDateString();
    if (lastStudyDate === today) {
        // Already studied today, streak continues
    } else {
        const lastDate = new Date(lastStudyDate);
        const todayDate = new Date(today);

        // Check if the last study date was yesterday
        if (lastStudyDate && (todayDate.getTime() - lastDate.getTime() === 24 * 60 * 60 * 1000)) {
            dailyStreak++;
        } else {
            dailyStreak = 1; // Start a new streak
        }
        lastStudyDate = today;
    }
    saveStreak();
    updateStreakDisplay();
}

function saveStreak() {
    localStorage.setItem(STORAGE_STREAK_KEY, dailyStreak);
    localStorage.setItem(STORAGE_LAST_STUDY_DATE_KEY, lastStudyDate);
}

function loadStreak() {
    const storedStreak = localStorage.getItem(STORAGE_STREAK_KEY);
    const storedLastStudyDate = localStorage.getItem(STORAGE_LAST_STUDY_DATE_KEY);
    if (storedStreak) {
        dailyStreak = parseInt(storedStreak, 10);
    }
    if (storedLastStudyDate) {
        lastStudyDate = storedLastStudyDate;
    }
}

function updateStreakDisplay() {
    if (streakDaysDisplay) {
        streakDaysDisplay.textContent = `${dailyStreak} days`;
    }
}

// --- Placeholder for other features ---
// Parent View, Export/Import JSON, PWA, Focus Mode, etc.
// These will be implemented as needed.

// --- Focus Mode ---
let isFocusMode = false;
const focusModeButton = document.createElement('button'); // Placeholder, will add to DOM later
focusModeButton.textContent = 'Focus Mode';
// Add styling and event listener for focusModeButton

function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    if (isFocusMode) {
        activateFocusMode();
    } else {
        deactivateFocusMode();
    }
}

function activateFocusMode() {
    document.body.classList.add('focus-mode');
    // Hide elements not needed in focus mode
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    document.querySelector('.planner').style.display = 'none';
    document.querySelector('.journal').style.display = 'none';
    document.querySelector('.gamification').style.display = 'none';
    document.querySelector('.study-log').style.display = 'none'; // Hide study log within timer section

    // Make timer controls larger and simpler
    document.querySelector('.timer-controls').classList.add('focus-mode-timer');
    document.querySelector('.timer-display').style.fontSize = '60px';
    document.querySelector('.timer-options').style.flexDirection = 'column';
    document.querySelector('.timer-options button').style.padding = '15px 30px';
    document.querySelector('.timer-options input').style.width = '80px';
    document.querySelector('.subject-selection').style.display = 'none'; // Hide subject selection

    // Add a button to exit focus mode
    const exitFocusButton = document.createElement('button');
    exitFocusButton.textContent = 'Exit Focus Mode';
    exitFocusButton.style.marginTop = '20px';
    exitFocusButton.style.padding = '10px 20px';
    exitFocusButton.style.backgroundColor = '#f44336'; // Red color for exit
    exitFocusButton.style.color = 'white';
    exitFocusButton.style.border = 'none';
    exitFocusButton.style.borderRadius = '12px';
    exitFocusButton.style.cursor = 'pointer';
    exitFocusButton.addEventListener('click', deactivateFocusMode);
    document.querySelector('.timer-controls').appendChild(exitFocusButton);
}

function deactivateFocusMode() {
    document.body.classList.remove('focus-mode');
    // Show elements again
    document.querySelector('header').style.display = '';
    document.querySelector('footer').style.display = '';
    document.querySelector('.planner').style.display = '';
    document.querySelector('.journal').style.display = '';
    document.querySelector('.gamification').style.display = '';
    document.querySelector('.study-log').style.display = '';

    document.querySelector('.timer-controls').classList.remove('focus-mode-timer');
    document.querySelector('.timer-display').style.fontSize = '';
    document.querySelector('.timer-options').style.flexDirection = '';
    document.querySelector('.timer-options button').style.padding = '';
    document.querySelector('.timer-options input').style.width = '';
    document.querySelector('.subject-selection').style.display = '';

    // Remove the exit focus button
    const exitFocusButton = document.querySelector('.timer-controls button[textContent="Exit Focus Mode"]');
    if (exitFocusButton) {
        exitFocusButton.remove();
    }
    isFocusMode = false;
}

// Add a button for Focus Mode to the header or settings
// For now, let's add it to the header for testing
const header = document.querySelector('header');
const focusModeToggle = document.createElement('button');
focusModeToggle.textContent = 'Focus';
focusModeToggle.style.marginLeft = '10px';
focusModeToggle.style.padding = '5px 10px';
focusModeToggle.style.border = 'none';
focusModeToggle.style.borderRadius = '5px';
focusModeToggle.style.cursor = 'pointer';
focusModeToggle.addEventListener('click', toggleFocusMode);
header.appendChild(focusModeToggle);

// --- Parent View ---
function openParentView() {
    // This is a placeholder for the parent view functionality.
    // It would typically involve displaying a summary of the child's progress.
    alert("Opening Parent View. This feature is still under development.");
    // Example: Display total study hours, streak, recent journal entries, etc.
    // Could also include a print PDF button.
}

// Add a button for Parent View to the header or settings
const parentViewButton = document.createElement('button');
parentViewButton.textContent = 'Parent View';
parentViewButton.style.marginLeft = '10px';
parentViewButton.style.padding = '5px 10px';
parentViewButton.style.border = 'none';
parentViewButton.style.borderRadius = '5px';
parentViewButton.style.cursor = 'pointer';
parentViewButton.addEventListener('click', openParentView);
header.appendChild(parentViewButton);


// --- Gamification Rewards ---
const REWARD_CRITERIA = {
    FIRST_SESSION: { name: "First Study Session", condition: () => studyLogEntries.length >= 1 },
    THREE_DAY_STREAK: { name: "3-Day Streak", condition: () => dailyStreak >= 3 },
    TEN_HOURS_STUDY: { name: "10 Hours Studied", condition: () => calculateTotalStudyHours() >= 10 },
    FIVE_SESSIONS: { name: "5 Study Sessions", condition: () => studyLogEntries.length >= 5 },
    COMPLETED_SUBJECT: { name: "Completed a Subject", condition: () => hasCompletedSubject() }
};

const earnedRewards = [];
const studiedSubjects = new Set(); // To track subjects studied

function calculateTotalStudyHours() {
    return studyLogEntries.reduce((total, entry) => total + entry.duration, 0) / 60; // duration is in minutes
}

function hasCompletedSubject() {
    // A subject is considered completed if it has been studied at least once.
    // This is a basic implementation; could be expanded to require a certain duration or number of sessions.
    return studiedSubjects.size > 0;
}

function checkAndAwardRewards() {
    // Ensure rewards are checked on load as well
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', awardRewardsOnLoad);
    } else {
        awardRewardsOnLoad();
    }

    for (const rewardKey in REWARD_CRITERIA) {
        const reward = REWARD_CRITERIA[rewardKey];
        if (reward.condition() && !earnedRewards.includes(reward.name)) {
            earnedRewards.push(reward.name);
            displayReward(reward.name);
        }
    }
}

function awardRewardsOnLoad() {
    // Check rewards when the page loads
    checkAndAwardRewards();
}

function displayReward(rewardName) {
    const rewardsList = document.querySelector('.rewards-list');
    const rewardItem = document.createElement('div');
    rewardItem.classList.add('reward-item');

    let icon = '';
    switch(rewardName) {
        case "First Study Session": icon = "⭐"; break;
        case "3-Day Streak": icon = "🔥"; break;
        case "10 Hours Studied": icon = "📚"; break;
        case "5 Study Sessions": icon = "🚀"; break; // New icon for 5 sessions
        case "Completed a Subject": icon = "🏆"; break;
        default: icon = "💡";
    }

    rewardItem.innerHTML = `
        <span class="reward-icon">${icon}</span>
        <p>${rewardName}</p>
    `;
    rewardsList.appendChild(rewardItem);
}

// Update handleTimerEnd to check for rewards
function handleTimerEnd() {
    const duration = parseInt(durationInput.value, 10);
    logStudySession(currentSubject, duration);
    updateStreak();
    checkAndAwardRewards(); // Check for rewards after a session ends
    // Potentially trigger a notification here
}

// --- Chart Initialization (already in HTML, but good to have a reference) ---
const ctx = miniProgressChartCanvas.getContext('2d');
const miniProgressChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Study Hours',
            data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros
            backgroundColor: [
                'rgba(76, 175, 80, 0.6)', // Primary color
                'rgba(255, 193, 7, 0.6)', // Secondary color
                'rgba(76, 175, 80, 0.6)',
                'rgba(255, 193, 7, 0.6)',
                'rgba(76, 175, 80, 0.6)',
                'rgba(255, 193, 7, 0.6)',
                'rgba(220, 220, 220, 0.6)' // Neutral for no study
            ],
            borderColor: [
                'rgba(76, 175, 80, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(220, 220, 220, 1)'
            ],
            borderWidth: 1,
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Function to update the chart with study log data
function updateProgressChart() {
    const dailyHours = {
        0: 0, // Sunday
        1: 0, // Monday
        2: 0, // Tuesday
        3: 0, // Wednesday
        4: 0, // Thursday
        5: 0, // Friday
        6: 0  // Saturday
    };

    studyLogEntries.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
        dailyHours[dayOfWeek] += entry.duration;
    });

    // Update chart data
    miniProgressChart.data.datasets[0].data = [
        dailyHours[1], // Monday
        dailyHours[2], // Tuesday
        dailyHours[3], // Wednesday
        dailyHours[4], // Thursday
        dailyHours[5], // Friday
        dailyHours[6], // Saturday
        dailyHours[0]  // Sunday
    ];
    miniProgressChart.update();
}

// Call updateProgressChart after loading logs and after each new log entry
document.addEventListener('DOMContentLoaded', () => {
    loadJournalEntries();
    loadStreak();
    loadStudyLog();
    updateStreakDisplay();
    setupEventListeners();
    updateProgressChart(); // Update chart on load
    updateTimerDisplay(0);
});

// Modify logStudySession to also call updateProgressChart
function logStudySession(subject, duration) {
    const logEntry = {
        timestamp: new Date().toLocaleString(),
        subject: subject,
        duration: duration
    };
    studyLogList.prepend(createLogEntryElement(logEntry));
    studyLogEntries.push(logEntry);
    saveStudyLog();
    updateProgressChart(); // Update chart after logging a session
}

// --- Planner Functions ---
function handleSubjectClick(event) {
    const clickedSubject = event.target.textContent;
    currentSubject = clickedSubject;
    subjectSelect.value = clickedSubject; // Update the dropdown

    // Scroll to the timer section
    const timerSection = document.querySelector('.timer-tracker');
    if (timerSection) {
        timerSection.scrollIntoView({ behavior: 'smooth' });
    }
}
