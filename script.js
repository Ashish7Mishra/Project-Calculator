const STORAGE_KEY = "calc_history"; 

const inputTxt = document.getElementById("input-txt");
const buttons = document.querySelectorAll(".buttons-grid button"); 

const historyBtn = document.getElementById("history-btn");
const historyModal = document.getElementById("history-modal");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const closeHistoryBtn = document.getElementById("close-history-btn");

const copyBtn = document.getElementById("copy-btn"); // --- NEW: Get the copy button


function loadHistory() {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return [];
    }
    try {
        return JSON.parse(raw);
    } 
    catch {
        return [];
    }

}

function saveHistory() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
        
    }
}

let history = loadHistory();

function toggleCopyButtonVisibility() {
    if (inputTxt.value.length > 0 && inputTxt.value !== "Error") {
        copyBtn.classList.add("show");
    } else {
        copyBtn.classList.remove("show");
    }
}

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

    toggleCopyButtonVisibility(); 
}

function appendValue(value) {
    inputTxt.value += value;
}

function isValidExpression(expr) {
    return /^[\d+\-*/. ()]+$/.test(expr) && !(/[\+\-*/]{2,}/.test(expr));
}

function calculate() {
    const expr = inputTxt.value;
    if (!expr || !isValidExpression(expr)) {
        inputTxt.value = "Error";
        toggleCopyButtonVisibility(); 
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
    toggleCopyButtonVisibility(); 
}

function clearResult() {
    inputTxt.value = "";
}

function deleteLast() {
    inputTxt.value = inputTxt.value.slice(0, -1);
}

function addToHistory(expression, result) {
    history.unshift(`${expression} = ${result}`);
    if (history.length > 10) {
        history.length = 10;
    }
    saveHistory();
}

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


buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        handleInput(btn.dataset.value);
    });
});


document.addEventListener("keydown", (e) => {
    const keyMap = { Enter: "=", Backspace: "DEL", Delete: "DEL", Escape: "C" };
    const val = keyMap[e.key] || e.key;
    const button = document.querySelector(`button[data-value="${val}"]`);
    if (!button) return;


    handleInput(val);
});

historyBtn.addEventListener("click", () => {
    updateHistoryModal();
    historyModal.classList.remove("hidden");
});

closeHistoryBtn.addEventListener("click", () => {
    historyModal.classList.add("hidden");
});

clearHistoryBtn.addEventListener("click", () => {
    history = [];
    saveHistory();
    updateHistoryModal();
});

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(inputTxt.value).then(() => {

        const icon = copyBtn.querySelector("i");
        icon.classList.remove("fa-copy");
        icon.classList.add("fa-check");
        copyBtn.title = "Copied!";

        setTimeout(() => {
            icon.classList.remove("fa-check");
            icon.classList.add("fa-copy");
            copyBtn.title = "Copy to clipboard";
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});