// logic of the Snake Game
/*
- 3 frame per second.
- in each frame snake will move one block forward;
- if snake eat snake, that will be added to the end of the snake, increase length by one block;
- in boxes each box has a coordinate, like (0,0), (0,1), (0,2), (1,1), (1,2);
- we will maintain an array of objects for each block(coordinate);
*/

// calculate : the total number of rows & column, according to screen size
const board = document.querySelector('.board');
const startButton = document.querySelector(".btn-start");
const startGame = document.querySelector(".start-game");
const gameOver = document.querySelector(".game-over");
const modal = document.querySelector(".modal");
const restartButton = document.querySelector(".btn-restart")
const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");


const blockHeight = 32;
const blockWidth = 32;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
const blocks = [];
let intervalId = null;
let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
}
let highScore = localStorage.getItem("highScore")||0;
let score = 0;
let time = `00-00`;
let timerIntervalId = null;
highScoreElement.innerText = highScore;

// start position of snake.
let snake = [
    { x: 1, y: 3 },
    // {x : 1, y : 4}, 
    // {x : 1, y : 5},
]

// direction of snake
let directions = 'right';

// add eventLister to get the directions
addEventListener("keydown", (Event) => {
    if (event.key === "ArrowUp") directions = "top";
    else if (event.key === "ArrowRight") directions = "right";
    else if (event.key === "ArrowLeft") directions = "left";
    else if (event.key === "ArrowDown") directions = "bottom";
});

// create boxex rows*cols times. like 3x3 = 9 boxes will be created.
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = `${row},${col}`; 
        blocks[`(${row},${col})`] = block;
    }
}

// render : snake on board
function render() {
    blocks[`(${food.x},${food.y})`].classList.add("food");
    // remove fill, so snake will look like moving
    snake.forEach(segment => {
        blocks[`(${segment.x},${segment.y})`].classList.remove("fill");
    })

    head = null;
    if (directions === "left") head = { x: snake[0].x, y: snake[0].y - 1 }
    else if (directions === "right") head = { x: snake[0].x, y: snake[0].y + 1 }
    else if (directions === "top") head = { x: snake[0].x - 1, y: snake[0].y }
    else if (directions === "bottom") head = { x: snake[0].x + 1, y: snake[0].y };

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        modal.style.display = "flex";
        clearInterval(intervalId);
        startGame.style.display = "none";
        gameOver.style.display = "flex"
        return;
    }; // alret if snake went outside of blocks

    snake.unshift(head); // add head at the beginning of the array
    snake.pop(); // remove element from the end of array

    snake.forEach(segment => {
        blocks[`(${segment.x},${segment.y})`].classList.add("fill"); // select snake
    });

    if (food.x === head.x && food.y === head.y) {
        // Remove old food
        blocks[`(${food.x},${food.y})`].classList.remove("food");
        // Generate new food coordinates
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
        // Optionally grow snake (optional)
        snake.push(snake[snake.length - 1]);
        score += 10;
        scoreElement.innerText = score;
        if(score>highScore){
            highScore = score;
            highScoreElement.innerText = highScore;
            localStorage.setItem("highScore", highScore.toString());
        }
    }
}

restartButton.addEventListener("click", restartGame)

function restartGame() {
    clearInterval(intervalId);
    blocks[`(${food.x},${food.y})`].classList.remove("food");
    // remove fill, so snake will look like moving
    snake.forEach(segment => {
        blocks[`(${segment.x},${segment.y})`].classList.remove("fill");
    })
    modal.style.display = "none";
    snake = [
        { x: 1, y: 3 },
    ]
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };
    intervalId = setInterval(() => {
        render()
    }, 500);
    directions = "right"; // or any safe starting direction
    score = 0;
    time = `00-00`
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;
    timeElement.innerText = time;
}



startButton.addEventListener("click", () => {
    modal.style.display = "none";
    intervalId = setInterval(() => {
        render()
    }, 500);
    timerIntervalId = setInterval(()=>{
        let [min, sec] = time.split("-").map(Number);
        if(sec==59){
            min += 1;
            sec = 0;
        } else{
            sec += 1;
        }
        time = `${min}-${sec}`;
        timeElement.innerText = time;
    },1000)
})





