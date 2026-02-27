// --- Card Data ---

const cardDataRaw = [
  // ประเภทแบบทดสอบ (Types of Achievement Test)
  { id: 1, type: "term", text: "แบบทดสอบผลสัมฤทธิ์ (Achievement Test)" },
  {
    id: 1,
    type: "def",
    text: "แบบทดสอบความสามารถทางด้านการรู้คิดของบุคคล ซึ่งเป็นผลมาจากประสบการณ์ในการเรียนรู้ที่บุคคลได้รับจากการเรียนการสอนในช่วงระยะเวลาหนึ่ง ๆ",
  },

  { id: 2, type: "term", text: "แบบทดสอบอัตนัย (Subjective Test)" },
  {
    id: 2,
    type: "def",
    text: "แบบทดสอบที่ให้ผู้สอบแสดงความคิดเห็นอย่างอิสระ วัดการคิดระดับสูงและการสังเคราะห์",
  },

  { id: 3, type: "term", text: "แบบทดสอบการปฏิบัติ (Performance Test)" },
  {
    id: 3,
    type: "def",
    text: "การวัดผลจากการกระทำจริง โดยประเมินได้ทั้งกระบวนการ (Process) และผลผลิต (Product)",
  },

  { id: 4, type: "term", text: "แบบทดสอบอิงกลุ่ม (Norm-Referenced)" },
  {
    id: 4,
    type: "def",
    text: "การเปรียบเทียบคะแนนระหว่างบุคคลในกลุ่มเดียวกัน เพื่อจัดลำดับหรือจำแนกความสามารถ",
  },

  { id: 5, type: "term", text: "แบบทดสอบอิงเกณฑ์ (Criterion-Referenced)" },
  {
    id: 5,
    type: "def",
    text: "การเปรียบเทียบผลการสอบกับเกณฑ์มาตรฐานที่กำหนดไว้ เพื่อดูระดับความรู้ที่แท้จริง",
  },

  {
    id: 6,
    type: "term",
    text: "จุดมุ่งหมายหลักของการใช้แบบทดสอบผลสัมฤทธิ์คืออะไร",
  },
  {
    id: 6,
    type: "def",
    text: "เพื่อวัด ประเมิน เปรียบเทียบผลการเรียนรู้ของผู้เรียน",
  },

  { id: 7, type: "term", text: "พุทธิพิสัย (Cognitive Domain)" },
  {
    id: 7,
    type: "def",
    text: "พฤติกรรมเกี่ยวกับสติปัญญา ความรู้ และการคิด แบ่งเป็น 6 ระดับตามแนวคิดของ Bloom",
  },

  { id: 8, type: "term", text: "จิตพิสัย (Affective Domain)" },
  {
    id: 8,
    type: "def",
    text: "พฤติกรรมด้านความรู้สึก ทัศนคติ ค่านิยม และคุณธรรมที่สะท้อนผ่านการแสดงออก",
  },

  { id: 9, type: "term", text: "ทักษะพิสัย (Psychomotor Domain)" },
  {
    id: 9,
    type: "def",
    text: "ความสามารถในการปฏิบัติงานได้อย่างคล่องแคล่ว แม่นยำ และเป็นธรรมชาติ",
  },
];

// --- Game Logic Variables ---
let flippedCards = [];
let matchedPairs = 0;
let isBoardLocked = false;

// Fisher-Yates Shuffle Algorithm
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

// Generate the game board
function createBoard() {
  const board = document.getElementById("gameBoard");
  const shuffledCards = shuffle([...cardDataRaw]);

  shuffledCards.forEach((data) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = data.id;

    cardElement.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">?</div>
                        <div class="card-back">
                            <span>${data.text}</span>
                        </div>
                    </div>
                `;

    cardElement.addEventListener("click", flipCard);
    board.appendChild(cardElement);
  });
}

// Sound Controller - Local Version
const sounds = {
  flip: new Audio("sounds/flip.mp3"),
  correct: new Audio("sounds/correct.mp3"),
  wrong: new Audio("sounds/wrong.mp3"),
};

function playSound(name) {
  if (sounds[name]) {
    // This is crucial for fast clicking!
    // It rewinds the sound so it can play again immediately.
    sounds[name].currentTime = 0;
    sounds[name].play();
  }
}

// Handle card click
function flipCard() {
  if (isBoardLocked) return;
  if (this.classList.contains("flipped")) return; // Prevent clicking already flipped cards

  this.classList.add("flipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkForMatch();
  }

  playSound("flip");
}

// Check if the two flipped cards match
function checkForMatch() {
  const isMatch = flippedCards[0].dataset.id === flippedCards[1].dataset.id;
  isMatch ? disableCards() : unflipCards();
}

// If cards match: keep them flipped and turn green
function disableCards() {
  isBoardLocked = true;
  flippedCards.forEach((card) => {
    card.removeEventListener("click", flipCard);
    card.classList.add("matched");
  });

  matchedPairs++;
  playSound("correct");
  updateUI();
  resetBoardState();

  if (matchedPairs === cardDataRaw.length / 2) {
    setTimeout(() => alert("Congratulations! Mission Accomplished!"), 500);
  }
}

function updateUI() {
  const matchDisplay = document.getElementById("match-count");
  if (matchDisplay) {
    matchDisplay.textContent = matchedPairs;
  }
}

// If cards mismatch: show red, then flip back
function unflipCards() {
  isBoardLocked = true;

  // Apply red background
  flippedCards.forEach((card) => card.classList.add("mismatch"));
  playSound("wrong");

  setTimeout(() => {
    flippedCards.forEach((card) => {
      card.classList.remove("flipped");
      card.classList.remove("mismatch");
    });
    resetBoardState();
  }, 5000); // Wait 1.2s so user can see the mismatch
}

// Reset selection variables
function resetBoardState() {
  flippedCards = [];
  isBoardLocked = false;
}

// Initialize Game
createBoard();
