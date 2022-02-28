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

let counterClick = "";

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
  }else{
    startGame.classList.remove("d-none");
  }

  gameValue.type = getId;
  gameMode.classList.add("d-none");

  getBoard.addEventListener("click", placeShape.bind(this, getId));
};
botMode.addEventListener("click", choiceMode);
playerMode.addEventListener("click", choiceMode);

//Player nick validation
let checkPlayerPopup = document.querySelector(".btnStart");

const validationPlayer = e => {
  e.preventDefault();
  
  if (startGame.classList.contains("d-none")) {
    return false;
  }
  if (e.keyCode === 13 || e.type === "click") {
    console.log(e);
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

// Handle game
function handleGame(index, e) {
  const getShape = placeShape(index, e);
  const getResult = checkResult(getShape.index, getShape.shape, e);
  if (getResult !== "") {
    publishResault(getResult);
  }
  if (gameValue.type === "bot") {
      botAi(getShape.shape);
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
  } else {
    counterClick++;

    document.querySelector(".playerTwo").classList.toggle("active");
    document.querySelector(".playerOne").classList.toggle("active");

    if (counterClick % 2 != 0) {
      e.target.classList.add("circle");
    } else {
      e.target.classList.add("cross");
    }
  }
  let shape = e.target.classList[1];
  return { index, shape };
}

function checkResult(index, shape, e) {
  if (shape == "circle") {
    checkCircle.push(index);
  } else {
    checkCross.push(index);
  }

  let result = "";

  winNumber.forEach((element) => {
    let winO = element.every(function (val) {
      return checkCircle.indexOf(val) !== -1;
    });
    let winX = element.every(function (val) {
      return checkCross.indexOf(val) !== -1;
    });

    if (winO == true) {
      result = "circle";
    } else if (winX == true) {
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
const botAi = shape => {
  if (shape === "circle") {
    setTimeout(() => {
      let move = "";
      let block = false;

      winNumber.forEach((e) => {
        let activeMovment = e.filter((x) => !checkCross.includes(x));
        let activeMovmentPlayer = e.filter((x) => !checkCircle.includes(x));

        if (activeMovment.length === 1) {
          let inet = activeMovment.values();

          for (const value of inet) {
            if (checkCross.includes(value) || checkCircle.includes(value)) {
              return false;
            } else {
              move = value;
            }
          }
        } else if (activeMovmentPlayer.length === 1) {
          let inet = activeMovmentPlayer.values();

          for (const value of inet) {
            if (checkCross.includes(value) || checkCircle.includes(value)) {
              return false;
            } else {
              move = value;
              block = true;
            }
          }
        } else if (activeMovment.length === 3 && !block) {
          let inet = activeMovment.values();
          for (const value of inet) {
            if (checkCross.includes(value) || checkCircle.includes(value)) {
              return false;
            } else {
              move = value;
            }
          }
        } 
        else {
          for (const value of e) {
            if (checkCross.includes(value) || checkCircle.includes(value)) {
              return false;
            } else {
              move = value
            }
          }
        }
      });
      console.log("move",move);
      if (checkCross.length + checkCircle.length !== 9) {
        getBoxAll[move].click();
      }
    }, 100);
  }
};

const playNext = (e) => {
  checkCircle = [];
  checkCross = [];

  if (document.querySelector(".winGame").classList.contains("d-none") != true) {
    document.querySelector(".winGame").classList.add("d-none");
    getBoxAll.forEach((element) => {
      element.classList.remove("circle");
      element.classList.remove("cross");
    });
  }

  //Adding first move
  if(gameValue.type === "bot" && gameSummary.games %2 !== 0 ){
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

  btnColorMode.textContent = getTheme;
  document.documentElement.style.setProperty("--primaryColor", getBgColor);
  document.documentElement.style.setProperty("--secondaryColor", getTextColor);
};

const btnGameMode = document.getElementById("btnGameMode");

//Clearing game value
const restartGame = () => {
  gameMode.classList.remove("d-none");
  startGame.classList.remove("d-none");

  playerOne.value = "";
  playerTwo.value = "";

  gameSummary.games = 0;
  gameSummary.winsPlayerOne = 0;
  gameSummary.winsPlayerTwo = 0;
  gameSummary.draws = 0;

  checkCircle = [];
  checkCross = [];

  counterClick = "";

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
