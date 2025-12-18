const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10;
const paddleHeight = 100;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
const leftPaddleX = 30;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
const rightPaddleX = canvas.width - 40;
const paddleVelocity = 5;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVelX = 6;
let ballVelY = 0;

let score1 = 0;
let score2 = 0;
const maxScore = 5;

let playing = false;

let wPressed = false;
let sPressed = false;

let animationId;

function startGame(e) {
  if (e.key === "Enter") {
    if (!playing) {
      gameLoop();
      playing = true;
    }
  }
}

function keyDownHandler(e) {
  switch (e.key) {
    case "w":
      wPressed = true;
      break;
    case "s":
      sPressed = true;
      break;
  }
}

function keyUpHandler(e) {
  switch (e.key) {
    case "w":
      wPressed = false;
      break;
    case "s":
      sPressed = false;
      break;
  }
}

function updatePaddle() {
  if (wPressed && leftPaddleY > 0) {
    leftPaddleY -= paddleVelocity;
  } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += paddleVelocity;
  }

  let computerLevel = 0.06;
  rightPaddleY += (ballY - (rightPaddleY + paddleHeight / 2)) * computerLevel;
  if (rightPaddleY < 0) {
    rightPaddleY = 0;
  }
  if (rightPaddleY + paddleHeight > canvas.height) {
    rightPaddleY = canvas.height - paddleHeight;
  }
}

function updateBall() {
  ballX += ballVelX;
  ballY += ballVelY;
}

function collisionDetection() {
  if (ballY - ballRadius < 0) {
    ballY = ballRadius;
    ballVelY = -ballVelY;
  }
  if (ballY + ballRadius > canvas.height) {
    ballY = canvas.height - ballRadius;
    ballVelY = -ballVelY;
  }
  if (ballX - ballRadius < leftPaddleX + paddleWidth) {
    if (ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
      ballX = leftPaddleX + paddleWidth + ballRadius;
      ballVelX = -ballVelX;
      ballVelY = Math.random() * 10 - 5;
    }
  }
  if (ballX + ballRadius > rightPaddleX) {
    if (ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
      ballX = rightPaddleX - ballRadius;
      ballVelX = -ballVelX;
      ballVelY = Math.random() * 10 - 5;
    }
  }
}

function addScore() {
  if (ballX + ballRadius > canvas.width) {
    score1++;
    if (score1 < maxScore) {
      resetBall();
    }
  }
  if (ballX - ballRadius < 0) {
    score2++;
    if (score2 < maxScore) {
      resetBall();
    }
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballVelX = -ballVelX;
  ballVelY = 0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.font = "bold 50px sans-serif";

  ctx.fillRect(leftPaddleX, leftPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(rightPaddleX, rightPaddleY, paddleWidth, paddleHeight);

  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.fillText(score1, canvas.width / 2 - 80, canvas.height / 3);
  ctx.fillText(score2, canvas.width / 2 + 50, canvas.height / 3);

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
}

function gameLoop() {
  updatePaddle();
  updateBall();
  collisionDetection();
  addScore();
  draw();

  if (score1 === maxScore || score2 === maxScore) {
    stopGame();
  } else {
    animationId = requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  cancelAnimationFrame(animationId);
  ctx.fillText("Game Over", canvas.width / 2 - 145, canvas.height / 2 + 100);

  setTimeout(() => {
    resetCanvas();
    draw();
    playing = false;
  }, 3000);
}

function resetCanvas() {
  leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  rightPaddleY = canvas.height / 2 - paddleHeight / 2;
  resetBall();
  score1 = 0;
  score2 = 0;
}

document.addEventListener("keydown", startGame);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

draw();