// ===============================
// SNAKE GAME LOGIC
// ===============================

// Basic idea of the game:
// - Snake moves one block every frame.
// - When snake touches food → score increases + snake grows.
// - If snake touches wall → game over.
// - Board is made of small blocks, each has (row, col) coordinate.
// - We store all blocks inside an object for fast lookup.


// ===============================
// DOM ELEMENTS
// ===============================
const board = document.querySelector('.board');
const startButton = document.querySelector(".btn-start");
const startGame = document.querySelector(".start-game");
const gameOver = document.querySelector(".game-over");
const modal = document.querySelector(".modal");
const restartButton = document.querySelector(".btn-restart")
const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");
const pauseBtn = document.querySelector(".pause-btn");


// ===============================
// BOARD, SNAKE & FOOD VARIABLES
// ===============================
const blockHeight = 32;  // each grid block height
const blockWidth = 32;   // each grid block width

// calculate total number of rows & columns based on available board size
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

// Object for storing each block using coordinate keys: (row,col)
const blocks = [];

// setInterval ID to control game loop (movement)
let intervalId = null;

// generate initial random food coordinate
let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
}

// load highscore from localStorage
let highScore = localStorage.getItem("highScore") || 0;
let score = 0;

// time formatted as "minutes-seconds"
let time = `00-00`;
let timerIntervalId = null;

// display saved high score
highScoreElement.innerText = highScore;

// initial variable for touch position
let startX;
let startY;
let endX;
let endY;
let speed = 400;  // initial speed of snake
let isPaused = false;


// ===============================
// INITIAL SNAKE POSITION
// ===============================
let snake = [
    { x: 1, y: 3 },  // starting position of snake head
]

// default movement direction
let directions = 'right';


// ===============================
// KEYBOARD CONTROLS
// ===============================
// Using arrow keys to update snake direction
addEventListener("keydown", (event) => {
    if (isPaused) return;
    if (snake.length === 1) {
        if (event.key === "ArrowUp") directions = "top";
        else if (event.key === "ArrowRight") directions = "right";
        else if (event.key === "ArrowLeft") directions = "left";
        else if (event.key === "ArrowDown") directions = "bottom";
    } else {
        if (event.key === "ArrowUp" && directions !== "bottom") directions = "top";
        else if (event.key === "ArrowRight" && directions !== "left") directions = "right";
        else if (event.key === "ArrowLeft" && directions !== "right") directions = "left";
        else if (event.key === "ArrowDown" && directions !== "top") directions = "bottom";
    }
});


// ===============================
// CREATE GRID BLOCKS
// ===============================
// Creating grid cells dynamically based on rows and columns
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block"); // style class
        board.appendChild(block);
        // store each block reference using coordinate key
        blocks[`(${row},${col})`] = block;
    }
}

// calculate touchStart & touchEnd position
board.addEventListener("touchstart", (event) => {
    event.preventDefault(); // brower stop default behaviour for particular event
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

board.addEventListener("touchend", (event) => {
    if (isPaused) return;
    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;
    const dx = endX - startX;
    const dy = endY - startY;
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return; // prevent accidental swaps
    if (Math.abs(dx) > Math.abs(dy)) {
        if (snake.length === 1) {
            if (dx > 0) directions = "right";
            else if (dx < 0) directions = "left";
        } else {
            if (dx > 0 && directions !== "left") directions = "right";
            else if (dx < 0 && directions !== "right") directions = "left";
        }
    } else {
        if (snake.length === 1) {
            if (dy > 0) directions = "bottom";
            else if (dy < 0) directions = "top";
        } else {
            if (dy > 0 && directions !== "top") directions = "bottom";
            else if (dy < 0 && directions !== "bottom") directions = "top";
        }
    }
});


// ===============================
// GAME LOOP → RENDER FUNCTION
// Runs every 500ms using setInterval
// ===============================
function render() {

    // ----- draw food -----
    blocks[`(${food.x},${food.y})`].classList.add("food");

    // ----- remove old snake blocks so movement appears smooth -----
    snake.forEach(segment => {
        blocks[`(${segment.x},${segment.y})`].classList.remove("fill");
    })

    // ----- calculate new head position based on direction -----
    head = null;
    if (directions === "left") head = { x: snake[0].x, y: snake[0].y - 1 }
    else if (directions === "right") head = { x: snake[0].x, y: snake[0].y + 1 }
    else if (directions === "top") head = { x: snake[0].x - 1, y: snake[0].y }
    else if (directions === "bottom") head = { x: snake[0].x + 1, y: snake[0].y };

    // ----- collision with wall → game over -----
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        modal.style.display = "flex";
        clearInterval(intervalId); // stop movement
        startGame.style.display = "none";
        gameOver.style.display = "flex"
        return; // exit function
    };

    // ----- add new head to snake & remove last block -----
    snake.unshift(head);  // moves snake forward
    snake.pop();          // removes tail (unless growing)

    // ----- draw updated snake position -----
    snake.forEach(segment => {
        blocks[`(${segment.x},${segment.y})`].classList.add("fill");
    });

    // ----- when snake touches food -----
    if (food.x === head.x && food.y === head.y) {

        // remove old food
        blocks[`(${food.x},${food.y})`].classList.remove("food");

        // generate new food
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };

        // grow snake by duplicating last block
        snake.push(snake[snake.length - 1]);

        // increase score
        score += 10;
        scoreElement.innerText = score;

        // update high score
        if (score > highScore) {
            highScore = score;
            highScoreElement.innerText = highScore;
            localStorage.setItem("highScore", highScore.toString());
        }

        if (score >= 20 && score < 50) speed = 350;
        else if (score >= 50 && score < 100) speed = 300;
        else if (score >= 100 && score < 150) speed = 250;
        else if (score >= 150) speed = 200;
        clearInterval(intervalId);
        intervalId = setInterval(render, speed)
    }
}

// Pause & Resume
pauseBtn.addEventListener("click", (event) => {
    if (isPaused === false) {
        // pause
        clearInterval(intervalId);
        clearInterval(timerIntervalId);
        isPaused = true;
        pauseBtn.innerText = "Resume"
    } else if (isPaused === true) {
        intervalId = setInterval(() => {
            render();
        }, speed);
        timerIntervalId = setInterval(() => {

            let [min, sec] = time.split("-").map(Number);

            if (sec == 59) {
                min += 1;
                sec = 0;
            } else {
                sec += 1;
            }

            // update time
            time = `${min}-${sec}`;
            timeElement.innerText = time;

        }, 1000)
        isPaused = false;
        pauseBtn.innerText = "Pause";
    }
});


// ===============================
// RESTART GAME
// ===============================
restartButton.addEventListener("click", restartGame)

function restartGame() {

    clearInterval(intervalId);  // stop old movement loop

    // remove food from previous game
    blocks[`(${food.x},${food.y})`].classList.remove("food");

    // remove old snake blocks
    snake.forEach(segment => {
        blocks[`(${segment.x},${segment.y})`].classList.remove("fill");
    })

    // hide modal
    modal.style.display = "none";

    // reset snake to initial position
    snake = [{ x: 1, y: 3 }];

    // generate new food position
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    // restart game loop
    intervalId = setInterval(() => {
        render()
    }, 500);

    // reset direction, score, time display
    directions = "right";
    score = 0;
    time = `00-00`
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;
    timeElement.innerText = time;
}



// ===============================
// START GAME BUTTON HANDLER
// ===============================
startButton.addEventListener("click", () => {

    modal.style.display = "none"; // close start popup

    // start movement loop
    intervalId = setInterval(() => {
        render()
    }, 500);

    // start timer (counts every second)
    timerIntervalId = setInterval(() => {

        let [min, sec] = time.split("-").map(Number);

        if (sec == 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }

        // update time
        time = `${min}-${sec}`;
        timeElement.innerText = time;

    }, 1000)
})