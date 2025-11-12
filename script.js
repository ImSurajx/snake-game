const board = document.querySelector('.board');
const blockHeight = 80;
const blockWidth = 80;

// logic of the Snake Game
/*
- 3 frame per second.
- in each frame snake will move one block forward;
- if snake eat snake, that will be added to the end of the snake, increase length by one block;
- in boxes each box has a coordinate, like (0,0), (0,1), (0,2), (1,1), (1,2);
- we will maintain an array of objects for each block(coordinate);
*/

// calculate : the total number of rows & column, according to screen size
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
const blocks = [];
let intervalId = null;
let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
}
// start position of snake.
const snake = [
    { x: 1, y: 3 },
    // {x : 1, y : 4}, 
    // {x : 1, y : 5},
]

// direction of snake
let directions = 'right'

// add eventLister to get the directions
addEventListener("keydown", (Event) => {
    if (event.key === "ArrowUp") directions = "top";
    else if (event.key === "ArrowRight") directions = "right";
    else if (event.key === "ArrowLeft") directions = "left";
    else if (event.key === "ArrowDown") directions = "bottom";
})

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

    if (head.x < 0 || head.x > rows || head.y < 0 || head.y > cols) {
        alert("Game Over");
        clearInterval(intervalId);
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
    }
}
intervalId = setInterval(() => {
    render();
}, 500);



