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

// create boxex rows*cols times. like 3x3 = 9 boxes will be created.
for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
    const block = document.createElement('div');
    block.classList.add("block");
    board.appendChild(block);
    block.innerText = `(${row},${col})`;
    blocks[`(${row},${col})`] = block;
    }
}


