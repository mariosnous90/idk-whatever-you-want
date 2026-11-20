const foods = [
  "🍕 Pizza", "🍔 Burgers", "🍣 Sushi", "🥙 Souvlaki", "🍝 Pasta",
  "🌮 Tacos", "🍜 Ramen", "🥡 Chinese", "🍛 Indian", "🥩 Steak",
  "🍗 Fried Chicken", "🥗 Salad", "🥪 Sandwiches", "🌯 Burritos", "🧆 Falafel",
  "🍤 Seafood", "🥞 Pancakes", "🍳 Brunch", "🥟 Dumplings", "🍟 Street Food",
  "🍖 BBQ", "🥘 Mexican", "🍲 Homemade Food", "🍦 Ice Cream", "🎲 SURPRISE ME!"
];

const foodOptions = document.getElementById("food-options");
const decideButton = document.getElementById("decide-btn");
const againButton = document.getElementById("again-btn");
const foodResult = document.getElementById("food-result");
const resultMessage = document.getElementById("result-message");
const resultCard = document.getElementById("result-card");
const catCorner = document.getElementById("cat-corner");
const catText = document.getElementById("cat-text");
const angryCat = document.getElementById("angry-cat");
const angerCount = document.getElementById("anger-count");
const angerFill = document.getElementById("anger-fill");
const catDoom = document.getElementById("cat-doom");
const hearts = document.getElementById("cat-hearts");
const optionCount = document.getElementById("option-count");
let rejections = 0;
const catReactions = [
  "the cat has spoken. NO TAKEBACKS!!!",
  "Okay, fine. Something else.",
  "YOU LITERALLY SAID ANYTHING.",
  "The cat is questioning your choices.",
  "WE COULD HAVE EATEN BY NOW.",
  "YOU SAID ANYTHING WAS FINE, JESSICA.",
  "THE CAT IS LOSING ITS MIND.",
  "I HAVE CANCELLED MY NAP FOR THIS.",
  "YOU HAVE ANGERED THE DINNER GODS.",
  "THIS IS YOUR FINAL WARNING.",
  "I'M CALLING YOUR MOTHER."
];
function updateAngryCat() {
  const level = Math.min(rejections, 10);
  angerCount.textContent = `Rejections: ${rejections}`;
  hearts.textContent = "■ ".repeat(Math.max(0, 5 - Math.ceil(level / 2))) + "□ ".repeat(Math.min(5, Math.ceil(level / 2)));
  angerFill.style.width = `${level * 10}%`;
  catText.textContent = catReactions[level];
  angryCat.textContent = `${level >= 10 ? '💀' : level >= 7 ? '🤬' : level >= 5 ? '😡' : level >= 3 ? '😾' : level >= 1 ? '😼' : '😎'}🐈`;
  catCorner.classList.toggle('cat-angry', level >= 3);
  catCorner.classList.toggle('cat-furious', level >= 7);
  catDoom.hidden = level < 10;
  document.body.classList.toggle('dinner-doom', level >= 10);
}


// Build the checkboxes from the same array used by the random picker.
foods.forEach((food) => {
  const label = document.createElement("label");
  label.className = "food-option";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = food;
  checkbox.checked = true;
  const name = document.createElement("span");
  name.textContent = food;
  label.append(checkbox, name);
  foodOptions.append(label);
  checkbox.addEventListener("change", () => { optionCount.textContent = `(${foodOptions.querySelectorAll("input:checked").length})`; });
});

// Keep the original random-index idea. Filter only tonight's exclusions.
const excludedTonight = new Set();
const lighterMeals = new Set(["🥗 Salad", "🥪 Sandwiches", "🧆 Falafel", "🍤 Seafood", "🍲 Homemade Food", "🍳 Brunch", "🥟 Dumplings"]);
let lightMode = false;
let currentFood = null;
let busy = false;
const excusePanel = document.getElementById("excuse-panel");
const excuseFeedback = document.getElementById("excuse-feedback");
const acceptButton = document.getElementById("accept-btn");
const lastDinner = document.getElementById("last-dinner");
const HISTORY_KEY = "idk-dinner-history-v3";
function readHistory() {
  try { const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
function updateHistory() {
  const history = readHistory();
  lastDinner.textContent = history.length ? `Last accepted: ${history[0].food} (${new Date(history[0].date).toLocaleDateString()}) · ${history.length} saved dinner${history.length === 1 ? "" : "s"}` : "No meals approved yet. The cat is concerned.";
}
function getRandomFood() {
  const checked = [...foodOptions.querySelectorAll('input:checked')].map(input => input.value);
  const surprise = checked.includes("🎲 SURPRISE ME!");
  let pool = foods.filter(food => food !== "🎲 SURPRISE ME!" && !excludedTonight.has(food) && (surprise || checked.includes(food)));
  if (lightMode) pool = pool.filter(food => lighterMeals.has(food));
  if (pool.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
const jokes = ["THE FOOD GODS HAVE SPOKEN. NO ARGUMENTS.", "THIS DECISION IS LEGALLY BINDING (probably).", "YOU'RE WELCOME. NOW GO EAT.", "100% SCIENTIFIC. 0% NEGOTIABLE.", "THE CAT APPROVES. THAT'S FINAL."];
function decideDinner() {
  document.querySelector(".decision").classList.remove("is-confirmed");
  currentFood = getRandomFood();
  if (currentFood === null) {
    foodResult.textContent = "NO OPTIONS LEFT 😭";
    resultMessage.textContent = "THE CAT HAS RUN OUT OF IDEAS. RECHECK SOME FOODS OR START A NEW ROUND.";
    againButton.hidden = true;
    acceptButton.hidden = true;
  } else {
    foodResult.textContent = currentFood;
    resultMessage.textContent = jokes[Math.floor(Math.random() * jokes.length)];
    againButton.hidden = false;
    acceptButton.hidden = false;
  }
  excusePanel.hidden = true;
  resultCard.classList.remove("reveal");
  void resultCard.offsetWidth;
  resultCard.classList.add("reveal");
}
decideButton.addEventListener("click", () => {
  excludedTonight.clear(); lightMode = false; rejections = 0; updateAngryCat();
  document.getElementById("options-drawer").hidden = true;
  document.getElementById("history-drawer").hidden = true;
  decideDinner();
});
againButton.addEventListener("click", () => {
  if (!currentFood) return;
  excusePanel.hidden = !excusePanel.hidden;
  document.getElementById("options-drawer").hidden = true;
  document.getElementById("history-drawer").hidden = true;
  excuseFeedback.textContent = "";
});
const responses = {
  recent: "THE CAT WILL AVOID IT TONIGHT. FINE.",
  mood: "YOUR MOOD HAS BEEN FILED UNDER 'MYSTERIOUS'.",
  light: "TINY APPETITE MODE ACTIVATED. DO NOT STEAL ALL MY FRIES.",
  yesterday: "SORRY THE CAT DIDN'T READ YOUR DIARY.",
  nope: "YOU SAID ANYTHING. THE CAT HAS RECEIPTS."
};
excusePanel.querySelectorAll("[data-excuse]").forEach(button => button.addEventListener("click", () => {
  if (busy || !currentFood) return;
  busy = true;
  const reason = button.dataset.excuse;
  excludedTonight.add(currentFood);
  if (reason === "light") lightMode = true;
  rejections++;
  updateAngryCat();
  excuseFeedback.textContent = responses[reason];
  excusePanel.querySelectorAll("button").forEach(b => b.disabled = true);
  setTimeout(() => {
    busy = false;
    excusePanel.querySelectorAll("button").forEach(b => b.disabled = false);
    decideDinner();
  }, 950);
}));
acceptButton.addEventListener("click", () => {
  if (!currentFood || acceptButton.hidden) return;
  const history = readHistory();
  history.unshift({food: currentFood, date: new Date().toISOString()});
  try {localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0,30)));} catch {}
  updateHistory();
  resultMessage.textContent = "💖 DINNER CONFIRMED. THE CAT CAN FINALLY REST.";
  document.querySelector(".decision").classList.add("is-confirmed");
  againButton.hidden = true;
  acceptButton.hidden = true;
  excusePanel.hidden = true;
  catText.textContent = "FINALLY. PEACE IN OUR TIME. 🐱💕";
});
document.getElementById("clear-history").addEventListener("click", () => {
  try {localStorage.removeItem(HISTORY_KEY);} catch {}
  updateHistory();
});
updateHistory();

// Compact drawers: show only one secondary panel at a time.
const drawers = ["options-drawer", "history-drawer", "excuse-panel"];
function toggleDrawer(id) {
  const target = document.getElementById(id);
  const shouldOpen = target.hidden;
  drawers.forEach(name => document.getElementById(name).hidden = true);
  target.hidden = !shouldOpen;
  if (shouldOpen) target.scrollIntoView({behavior: "smooth", block: "nearest"});
}
document.getElementById("options-toggle").addEventListener("click", () => toggleDrawer("options-drawer"));
document.getElementById("history-toggle").addEventListener("click", () => toggleDrawer("history-drawer"));
document.getElementById("nav-options").addEventListener("click", () => toggleDrawer("options-drawer"));
document.getElementById("nav-history").addEventListener("click", () => toggleDrawer("history-drawer"));
document.getElementById("nav-home").addEventListener("click", () => {drawers.forEach(id => document.getElementById(id).hidden = true); window.scrollTo({top:0,behavior:"smooth"});});
document.getElementById("nav-cat").addEventListener("click", () => document.getElementById("cat-corner").scrollIntoView({behavior:"smooth",block:"center"}));
document.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", () => document.getElementById(btn.dataset.close).hidden = true));
