const inputTxt = document.getElementById("input-txt");
const buttons = document.querySelectorAll(".buttons-grid button"); // calculator buttons only

const historyBtn = document.getElementById("history-btn");
const historyModal = document.getElementById("history-modal");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const closeHistoryBtn = document.getElementById("close-history-btn");

let history = [];

// Button click handling
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        handleInput(btn.dataset.value);
    });
});

// Keyboard input handling
document.addEventListener("keydown", (e) => {
    const keyMap = { Enter: "=", Backspace: "DEL", Delete: "DEL", Escape: "C" };
    const val = keyMap[e.key] || e.key;
    const button = document.querySelector(`button[data-value="${val}"]`);
    if (!button) return;
    handleInput(val);
});

// Main input handler
function handleInput(value) {
    if (value === "=") {
        calculate();
    } else if (value === "C") {
        clearResult();
    } else if (value === "DEL") {
        deleteLast();
    } else {
        appendValue(value);
    }
}

// Append value to input
function appendValue(value) {
    inputTxt.value += value;
}

// Validate expression using regex
function isValidExpression(expr) {
    return /^[\d+\-*/. ()]+$/.test(expr) && !(/[\+\-*/]{2,}/.test(expr));
}

// Calculate and update input & history
function calculate() {
    const expr = inputTxt.value;
    if (!isValidExpression(expr)) {
        inputTxt.value = "Error";
        return;
    }
    try {
        const result = eval(expr);
        if (typeof result === "number" && isFinite(result)) {
            inputTxt.value = result;
            addToHistory(expr, result);
        } else {
            inputTxt.value = "Error";
        }
    } catch {
        inputTxt.value = "Error";
    }
}

// Clear input field
function clearResult() {
    inputTxt.value = "";
}

// Delete last character
function deleteLast() {
    inputTxt.value = inputTxt.value.slice(0, -1);
}

// Add to history array and keep max 10
function addToHistory(expression, result) {
    history.unshift(`${expression} = ${result}`);
    if (history.length > 10) {
        history.pop();
    }
}

// Update history modal content
function updateHistoryModal() {
    historyList.innerHTML = "";
    if (history.length === 0) {
        historyList.innerHTML = "<p>No history yet.</p>";
        return;
    }
    history.forEach(item => {
        const div = document.createElement("div");
        div.textContent = item;
        div.classList.add("history-item");
        historyList.appendChild(div);
    });
}

// Show history modal on button click
historyBtn.addEventListener("click", () => {
    updateHistoryModal();
    historyModal.classList.remove("hidden");
});

// Close modal
closeHistoryBtn.addEventListener("click", () => {
    historyModal.classList.add("hidden");
});

// Clear history and update modal
clearHistoryBtn.addEventListener("click", () => {
    history = [];
    updateHistoryModal();
});
