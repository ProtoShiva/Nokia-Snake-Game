const board = document.querySelector("#game-board");
const instructionText = document.querySelector("#instruction-text");
const logo = document.querySelector("#logo");
const score = document.querySelector("#score");
const highScoreText = document.querySelector("#highScore");

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = JSON.parse(localStorage.getItem("points")) || 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
highScoreText.style.display = "block";
highScoreText.textContent = highScore.toString().padStart(3, "0");

const draw = () => {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
};

//Drawing the snake
const drawSnake = () => {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
};

//Create a snake or food by creating a div
const createGameElement = (tag, className) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
};

//set the postion of snake or food
const setPosition = (element, position) => {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
};

//drawing the food
const drawFood = () => {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
};

//generating random pos for food
function generateFood() {
  //When i made arrow function, it couldn't be accessed so i had to make it normal function.
  const x = Math.floor(Math.random() * gridSize + 1);
  const y = Math.floor(Math.random() * gridSize + 1);
  return { x, y };
}

const move = () => {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;

    default:
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
};

const startGame = () => {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
};

//kepress event listener to start the game

const handelKeyPress = (evt) => {
  if (
    (!gameStarted && evt.code === "Space") ||
    (!gameStarted && evt.key === " ")
  ) {
    startGame();
  } else {
    switch (evt.key) {
      case "ArrowUp":
        direction = "up";
        break;

      case "ArrowDown":
        direction = "down";
        break;

      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
};

document.addEventListener("keydown", handelKeyPress);

const increaseSpeed = () => {
  //   console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
};

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

const resetGame = () => {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
};

const updateScore = () => {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
};

const updateHighScore = () => {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem("points", JSON.stringify(highScore));
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
};

const stopGame = () => {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
};
