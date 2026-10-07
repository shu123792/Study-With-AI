const questionInput = document.getElementById("question");
const subjectInput = document.getElementById("subject");
const answerBox = document.getElementById("answer-box");
const askButton = document.getElementById("ask-button");

let questionCount = Number(localStorage.getItem("questionCount") || 0);
let sessionCount = Number(localStorage.getItem("sessionCount") || 0);

function updateProgress() {
    const progress = Math.min(questionCount * 10, 100);

    document.getElementById("question-count").textContent = questionCount;
    document.getElementById("session-count").textContent = sessionCount;
    document.getElementById("progress-value").textContent = `${progress}%`;

    document.querySelector(".progress-circle").style.background =
        `conic-gradient(#536dfe ${progress * 3.6}deg, #e9ecf5 0deg)`;
}

function focusChat() {
    questionInput.focus();
    questionInput.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function setQuestion(text) {
    questionInput.value = text;
    focusChat();
}

function showLoading() {
    answerBox.innerHTML = `
        <div class="answer-placeholder">
            <div class="big-sparkle">✦</div>
            <h3>Thinking...</h3>
            <p>StudyWithAI is preparing your answer.</p>
        </div>
    `;
}

async function askQuestion() {
    const message = questionInput.value.trim();
    const subject = subjectInput.value;

    if (!message) {
        questionInput.focus();
        return;
    }

    askButton.disabled = true;
    askButton.textContent = "Thinking...";
    showLoading();

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                subject
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        answerBox.innerHTML = `
            <div class="answer-content">${escapeHtml(data.answer)}</div>
        `;

        questionCount++;
        sessionCount++;

        localStorage.setItem("questionCount", questionCount);
        localStorage.setItem("sessionCount", sessionCount);

        updateProgress();

    } catch (error) {
        answerBox.innerHTML = `
            <div class="answer-content">
                Error: ${escapeHtml(error.message)}
                <br><br>
                Check that the FastAPI server is running.
            </div>
        `;
    } finally {
        askButton.disabled = false;
        askButton.textContent = "Ask StudyWithAI →";
    }
}

function escapeHtml(text) {
    const element = document.createElement("div");
    element.textContent = text;
    return element.innerHTML;
}

function resetProgress() {
    questionCount = 0;
    sessionCount = 0;

    localStorage.removeItem("questionCount");
    localStorage.removeItem("sessionCount");

    updateProgress();
}

function showPlanner() {
    const planner = document.getElementById("planner");

    planner.classList.remove("hidden");
    planner.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function addTask() {
    const taskInput = document.getElementById("task-input");
    const timeInput = document.getElementById("time-input");
    const taskList = document.getElementById("task-list");

    const task = taskInput.value.trim();
    const minutes = timeInput.value.trim();

    if (!task) {
        taskInput.focus();
        return;
    }

    const taskElement = document.createElement("div");
    taskElement.className = "task";

    taskElement.innerHTML = `
        <div>
            <strong>${escapeHtml(task)}</strong>
            <br>
            <small>${escapeHtml(minutes || "No time set")} minutes</small>
        </div>
        <button class="delete-task">Delete</button>
    `;

    taskElement.querySelector(".delete-task").addEventListener("click", () => {
        taskElement.remove();
    });

    taskList.appendChild(taskElement);

    taskInput.value = "";
    timeInput.value = "";
}

askButton.addEventListener("click", askQuestion);

questionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
        askQuestion();
    }
});

updateProgress();