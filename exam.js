let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputfield = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy:["apple","banana","grape","orange","cherry"],
     medium:["keyboard","monitor","printer","charger"],
     hard:["synchronize","complicated","development","extravagant","misconception"]
}

const highlightKey = (letter) => {
  const key = document.getElementById(`key-${letter.toLowerCase()}`);
  if (key) {
    key.classList.add("active");
    setTimeout(() => key.classList.remove("active"), 200);
  }
};

const getDynamicMode = () => {
    return modeSelect.value
};

const getRandomWords = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

const startTest = (wordCount = 30) => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWords(modeSelect.value)); 
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "blue";
        wordDisplay.appendChild(span);
    });

    inputfield.value = "";
    inputfield.disabled = false;
    results.textContent = "";
};

const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

const getCurrentsStats = () => {
    const elapsedTime = Date.now() - previousEndTime;
    const clickSpeed = (elapsedTime / 1000).toFixed(2);
    const accuracy = inputfield.value.length > 0
        ? ((wordsToType[currentWordIndex].length / inputfield.value.length) * 100).toFixed(2)
        : 0;
    return { clickSpeed, accuracy };
};

const updateWord = (event) => {
    if (event.key === " ") {
        if (inputfield.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;
            const { clickSpeed, accuracy } = getCurrentsStats();
            const mode = getDynamicMode();

            results.textContent = `⏱️ Temps : ${clickSpeed}s | 🎯 Précision : ${accuracy}% | 🔁 Mode : ${mode}`;

            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputfield.value = "";
            event.preventDefault();

            if (currentWordIndex >= wordsToType.length) {
                inputfield.disabled = true;
                results.textContent += " ✅ Test terminé !";
            }
        }
    }
};

const highlightNextWord = () => {
    const wordElements = wordDisplay.children;
    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "white";
        }
        wordElements[currentWordIndex].style.color = "blue";
    }
};

inputfield.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
    highlightKey(event.key);
});

// init clavier + jeu
createKeyboard();
startTest();


