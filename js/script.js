const getBoxAll = document.querySelectorAll(".box");
const winPopup = document.querySelector(".winGame");
const popupPlayer = document.querySelector(".winGame .playerName");
const playerOne = document.querySelector("#playerOne");
const playerTwo = document.querySelector("#playerTwo");

const startGame = document.querySelector(".startGame");
const playerBoard = document.querySelector(".players");

const gameSummary = {
  games: 0,
  winsPlayerOne: 0,
  winsPlayerTwo: 0,
  draws: 0,
};
const gameValue = {
  type: "",
  playerOne: "",
  playerTwo: "",
};
const winNumber = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

let checkCircle = [];
let checkCross = [];

let counterClick = 0;

//Check game mode
const gameMode = document.querySelector(".gameMode");
let playerMode = document.getElementById("player");
let botMode = document.getElementById("bot");

const getBoard = document.querySelector(".board");
const getBody = document.querySelector("body");

const choiceMode = (e) => {
  let getId = e.target.id;

  if (getId == "bot") {
    gameValue.playerOne = "Player";
    gameValue.playerTwo = "BOT";

    document.querySelector("#one").textContent = `${gameValue.playerOne}(o)`;
    document.querySelector("#two").textContent = `${gameValue.playerTwo}(x)`;
  } else {
    startGame.classList.remove("d-none");
  }

  gameValue.type = getId;
  gameMode.classList.add("d-none");

  getBoard.addEventListener("click", placeShape.bind(this, getId));
};
botMode.addEventListener("click", choiceMode);
playerMode.addEventListener("click", choiceMode);

//Player nick validation
let checkPlayerPopup = document.getElementById("btnStart")

const validationPlayer = e => {
  e.preventDefault();

  if (startGame.classList.contains("d-none")) {
    return false;
  }
  if (e.keyCode === 13 || e.type === "click") {
    if (playerOne.value.trim() !== "" && playerTwo.value.trim() !== "") {
      gameValue.playerOne = playerOne.value;
      gameValue.playerTwo = playerTwo.value;

      document.querySelector("#one").textContent = `${gameValue.playerOne}(o)`;
      document.querySelector("#two").textContent = `${gameValue.playerTwo}(x)`;

      startGame.classList.add("d-none");
      playerBoard.classList.remove("d-none");
    } else if (playerOne.value.trim() === "") {
      playerOne.style.border = "1px solid red";
      playerOne.focus();

      playerOne.addEventListener("input", checkValue);
    } else if (playerTwo.value.trim() === "") {
      playerTwo.style.border = "1px solid red";
      playerTwo.focus();

      playerTwo.addEventListener("input", checkValue);
    }
  }
};
getBody.addEventListener("keyup", validationPlayer);
checkPlayerPopup.addEventListener("click", validationPlayer);

function checkValue(e) {
  if (e.target.value.length != 0) {
    e.target.style.border = `1px solid ${localStorage.getItem("textColor")}`;
  } else {
    e.target.style.border = "1px solid red";
  }
}

// Go to the previous page
const backArrow = document.querySelector(".backArrow")

function previousPage() {
  gameMode.classList.remove("d-none")
  startGame.classList.add("d-none")
}
backArrow.addEventListener("click", previousPage)

// Handle game
function handleGame(index, e) {
  const getShape = placeShape(index, e);
  const getResult = checkResult(getShape.index, getShape.shape, e);
  if (getResult !== "") {
    publishResault(getResult);
  }
  if (gameValue.type === "bot") {
    botAi(getShape.shape, getResult);
  }
}
getBoxAll.forEach((box, index) => {
  box.addEventListener("click", handleGame.bind(this, index));
});

function placeShape(index, e) {
  if (
    e.target.classList.contains("circle") ||
    e.target.classList.contains("cross") ||
    e.target.classList.contains("board")
  ) {
    return false;
  }

  counterClick++;

  if (counterClick % 2 !== 0) {
    e.target.classList.add("circle");

    document.querySelector(".playerTwo").classList.add("active");
    document.querySelector(".playerOne").classList.remove("active");
  } else {
    e.target.classList.add("cross");

    document.querySelector(".playerTwo").classList.remove("active");
    document.querySelector(".playerOne").classList.add("active");
  }

  let shape = e.target.classList[1];
  return { index, shape };
}

function checkResult(index, shape, e) {
  if (index === undefined || shape === undefined) {
    return false
  }

  if (shape === "circle") {
    checkCircle.push(index);
  } else {
    checkCross.push(index);
  }

  let result = "";

  winNumber.forEach(e => {
    let winO = e.every(function (val) {
      return checkCircle.indexOf(val) !== -1;
    });
    let winX = e.every(function (val) {
      return checkCross.indexOf(val) !== -1;
    });

    if (winO === true) {
      result = "circle";
    } else if (winX === true) {
      result = "cross";
    }
  });

  if (checkCross.length + checkCircle.length === 9 && result === "") {
    result = "draw";
  }

  return result;
}

function publishResault(result) {
  if (result) {
    gameSummary.games++;

    document.querySelector(".win").classList.remove("d-none");
    switch (result) {
      case "circle":
        gameSummary.winsPlayerOne++;
        popupPlayer.textContent = gameValue.playerOne;
        break;
      case "cross":
        gameSummary.winsPlayerTwo++;
        popupPlayer.textContent = gameValue.playerTwo;
        break;
      case "draw":
        gameSummary.draws++;
        popupPlayer.textContent = "DRAW";
        document.querySelector(".win").classList.add("d-none");
        break;
      default:
        break;
    }

    winPopup.classList.remove("d-none");
  }

  document.querySelector(".counterWinOne").textContent =
    gameSummary.winsPlayerOne;
  document.querySelector(".counterWinTwo").textContent =
    gameSummary.winsPlayerTwo;
  document.querySelector(".counterDraw").textContent = gameSummary.draws;
}

//Ai
const botAi = (shape, result) => {
  //artificial time delay
  let delay = 100;

  if (shape === "circle" && result !== "draw") {
    const move = aiMove()
    setTimeout(() => {
      if (checkCross.length + checkCircle.length !== 9) {
        getBoxAll[move].click();
      }
    }, delay);
  }
}

function aiMove() {
  let move = "";
  let block = false;
  let winMove = false;

  winNumber.forEach((e) => {
    let activeMovmentBot = e.filter((x) => !checkCross.includes(x));
    let activeMovmentPlayer = e.filter((x) => !checkCircle.includes(x));

    if (activeMovmentBot.length === 1) {
      let index = activeMovmentBot.values();
      for (const value of index) {
        if (checkCross.includes(value) || checkCircle.includes(value)) {
          return false;
        } else {
          move = value;
          winMove = true;
        }
      }
    } else if (activeMovmentPlayer.length === 1 && !winMove) {
      let index = activeMovmentPlayer.values();
      for (const value of index) {
        if (checkCross.includes(value) || checkCircle.includes(value)) {
          return false;
        } else {
          move = value;
          block = true;
        }
      }
    } else if (
      (activeMovmentBot.length === 3 && !block && !winMove) ||
      (activeMovmentBot.length === 2 && !block && !winMove)
    ) {
      let index = activeMovmentBot.values();
      for (const value of index) {
        if (checkCross.includes(value) || checkCircle.includes(value)) {
          return false;
        } else {
          move = value;
        }
      }
    }
  });

  if (!move) {
    let boxAll = [...getBoxAll]

    let findClearBox = boxAll.find(e => !e.classList.contains("cross") && !e.classList.contains("circle"))
    move = findClearBox.dataset.type
  }

  return move;
}

const playNext = (e) => {
  //clear array
  checkCircle = [];
  checkCross = [];

  //funtion for placeShape, determines what mark starts
  counterClick = 0;
  if (gameSummary.games % 2 !== 0) {
    counterClick = 1
  }

  if (document.querySelector(".winGame").classList.contains("d-none") !== true) {
    document.querySelector(".winGame").classList.add("d-none");
    getBoxAll.forEach((element) => {
      element.classList.remove("circle");
      element.classList.remove("cross");
    });
  }

  //adding first move
  if (gameValue.type === "bot" && gameSummary.games % 2 !== 0) {
    document.querySelector("[data-type='4']").click()
  }
};
winPopup.addEventListener("click", playNext);

//Change color
const btnColorMode = document.getElementById("btnColor");
let countClick = localStorage.getItem("counerClick");

const changeColor = (e) => {
  countClick++;

  if (countClick % 2 == 0) {
    localStorage.setItem("theme", "Dark theme");
    localStorage.setItem("bgColor", "#222");
    localStorage.setItem("textColor", "#fff");
    localStorage.setItem("counerClick", "0");
  } else {
    localStorage.setItem("theme", "Light theme");
    localStorage.setItem("bgColor", "#fff");
    localStorage.setItem("textColor", "#000");
    localStorage.setItem("counerClick", "1");
  }

  let getBgColor = localStorage.getItem("bgColor");
  let getTextColor = localStorage.getItem("textColor");
  let getTheme = localStorage.getItem("theme");
  btnColorMode.textContent = getTheme;

  document.documentElement.style.setProperty("--primaryColor", getBgColor);
  document.documentElement.style.setProperty("--secondaryColor", getTextColor);
};
btnColorMode.addEventListener("click", changeColor);

window.onload = function () {
  let getBgColor = localStorage.getItem("bgColor");
  let getTextColor = localStorage.getItem("textColor");
  let getTheme = localStorage.getItem("theme");

  if (getTheme !== null) {
    btnColorMode.textContent = getTheme;
  }
  document.documentElement.style.setProperty("--primaryColor", getBgColor);
  document.documentElement.style.setProperty("--secondaryColor", getTextColor);
};

const btnGameMode = document.getElementById("btnGameMode");

//Clearing game value
const restartGame = () => {
  gameMode.classList.remove("d-none");

  playerOne.value = "";
  playerTwo.value = "";

  gameSummary.games = 0;
  gameSummary.winsPlayerOne = 0;
  gameSummary.winsPlayerTwo = 0;
  gameSummary.draws = 0;

  checkCircle = [];
  checkCross = [];

  counterClick = 0;

  gameValue.type = "";

  getBoxAll.forEach((box) => {
    if (box.classList.contains("circle")) {
      box.classList.remove("circle");
    } else if (box.classList.contains("cross")) {
      box.classList.remove("cross");
    }
  });

  document.querySelector(".counterWinOne").textContent = 0;
  document.querySelector(".counterWinTwo").textContent = 0;
  document.querySelector(".counterDraw").textContent = 0;
};
btnGameMode.addEventListener("click", restartGame);
