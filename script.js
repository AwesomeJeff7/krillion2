const rounds = [
  {
    prompt: "Name something you would find in a magician’s secret drawer",
    hint: "Specific beats obvious. The stranger the answer, the rarer it is.",
    common: ["cards", "rabbit", "wand", "top hat", "handkerchief", "coin", "coins", "magic book", "keys", "rope"],
    surprise: ["auditorium", "dove license", "a tiny emergency staircase", "confidence from 1987"]
  },
  {
    prompt: "Name a food that is dramatically better at night",
    hint: "It can be a dish, a snack, or an entire category of bad decisions.",
    common: ["pizza", "tacos", "ice cream", "cereal", "ramen", "chocolate", "cake", "burger", "fries", "popcorn"],
    surprise: ["cold lasagna", "hospital pudding", "gas station sushi", "reheated thanksgiving stuffing"]
  },
  {
    prompt: "Name an unusual talent for a housecat",
    hint: "Imagine it putting the skill on a résumé.",
    common: ["jumping", "hunting", "climbing", "sleeping", "purring", "catching mice", "running", "opening doors"],
    surprise: ["tax evasion", "reading subtext", "identifying unreliable narrators", "competitive staring"]
  },
  {
    prompt: "Name something a conspiracy theorist might keep in a sock drawer",
    hint: "The drawer matters. Ordinary things are hiding in plain sight.",
    common: ["maps", "documents", "photos", "flashlight", "keys", "cash", "notepad", "newspapers", "files"],
    surprise: ["three unblemished spoons", "a laminated timeline of pigeons", "the original black marker", "one stolen Tuesday"]
  },
  {
    prompt: "Name the most specific thing a museum should display",
    hint: "Skip famous masterpieces. Curate the absurdly particular.",
    common: ["dinosaurs", "art", "paintings", "statue", "fossils", "ancient coins", "egyptian artifacts", "weapons"],
    surprise: ["the first lie ever told", "all 47 moods of a rainy Tuesday", "a rejected moon name", "a haunted museum brochure"]
  }
];

let roundIndex = 0;
let score = 0;
let streak = 0;

const game = document.querySelector("#game");
const finish = document.querySelector("#finish");
const prompt = document.querySelector("#prompt");
const hint = document.querySelector("#hint");
const roundLabel = document.querySelector("#roundLabel");
const progress = document.querySelector("#progress");
const answerForm = document.querySelector("#answerForm");
const answerInput = document.querySelector("#answerInput");
const answerList = document.querySelector("#answerList");
const resultPanel = document.querySelector("#resultPanel");
const resultAnswer = document.querySelector("#resultAnswer");
const resultCopy = document.querySelector("#resultCopy");
const rarityValue = document.querySelector("#rarityValue");
const nextButton = document.querySelector("#nextButton");

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function renderRound() {
  const round = rounds[roundIndex];
  prompt.textContent = round.prompt;
  hint.textContent = round.hint;
  roundLabel.textContent = `ROUND ${roundIndex + 1} / ${rounds.length}`;
  progress.style.width = `${((roundIndex + 1) / rounds.length) * 100}%`;
  answerList.innerHTML = "";
  resultPanel.hidden = true;
  answerInput.disabled = false;
  answerInput.value = "";
  answerInput.focus();
}

function calculateRarity(answer) {
  const value = normalize(answer);
  const round = rounds[roundIndex];
  if (!value) return { rarity: 0, copy: "That answer needs a little more substance." };

  if (round.surprise.some(item => normalize(item) === value)) {
    return { rarity: 99, copy: "The kind of answer even our archive envies." };
  }

  const exactCommon = round.common.some(item => normalize(item) === value);
  if (exactCommon) {
    return { rarity: 18 + Math.floor(Math.random() * 18), copy: "Common signal. It is valid, but everyone had this idea." };
  }

  const partialCommon = round.common.some(item => {
    const words = value.split(" ");
    return words.includes(normalize(item));
  });

  if (partialCommon) {
    return { rarity: 42 + Math.floor(Math.random() * 20), copy: "A recognizable route, with a few fascinating detours." };
  }

  return { rarity: 68 + Math.floor(Math.random() * 29), copy: "Fresh on the trail. That answer is delightfully hard to predict." };
}

answerForm.addEventListener("submit", event => {
  event.preventEvent?.();
  event.preventDefault();
  const answer = answerInput.value.trim();
  if (!answer) {
    answerInput.animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "none" }], { duration: 180 });
    return;
  }

  const result = calculateRarity(answer);
  const points = result.rarity;
  score += points;
  streak = result.rarity >= 68 ? streak + 1 : 0;
  document.querySelector("#score").textContent = score;
  document.querySelector("#streak").textContent = streak;

  const chip = document.createElement("span");
  chip.className = `answer-chip ${result.rarity >= 68 ? "is-winner" : ""}`;
  chip.textContent = answer;
  answerList.append(chip);

  resultAnswer.textContent = answer;
  resultCopy.textContent = result.copy;
  rarityValue.textContent = result.rarity;
  resultPanel.hidden = false;
  answerInput.disabled = true;
  nextButton.focus();
});

nextButton.addEventListener("click", () => {
  roundIndex += 1;
  if (roundIndex >= rounds.length) {
    game.hidden = true;
    finish.hidden = false;
    document.querySelector("#finalScore").textContent = score;
    document.querySelector(".finish").animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 400 });
  } else {
    renderRound();
  }
});

document.querySelector("#playAgain").addEventListener("click", () => {
  roundIndex = 0;
  score = 0;
  streak = 0;
  document.querySelector("#score").textContent = "0";
  document.querySelector("#streak").textContent = "0";
  finish.hidden = true;
  game.hidden = false;
  renderRound();
});

document.querySelector("#copyScore").addEventListener("click", async event => {
  const text = `I scored ${score} points in KRILLION — I found the deep weird. 🦐`;
  try {
    await navigator.clipboard.writeText(text);
    event.currentTarget.textContent = "Copied!";
  } catch {
    event.currentTarget.textContent = "Score: " + score;
  }
});

renderRound();
