var context;
var canvas;
var score = 0;
var bestscore = 0;
var grid = 16;
var count = 0;
  
var snake = {
  x: 160,
  y: 160,
  
  // snake directin offsets
  dx: grid,
  dy: 0,
  
  // snake body
  cells: [],
  
  // snake body length, grows when eats an apple
  maxCells: 4
};
 
var apple = {
  x: 320,
  y: 320
};

function windowload() {
    canvas = document.getElementById('game');
    canvas.setAttribute('tabindex','0');
    canvas.focus();
    context = canvas.getContext('2d');
   
    // arrow keys to control the snake
    document.addEventListener('keydown', function(e) { 
      // left arrow key
      if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
      }
      // up arrow key
      else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
      }
      // right arrow key
      else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
      }
      // down arrow key
      else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
      }
    });
    window.requestAnimationFrame(loop);
  }

  // return a random integer between [min, max)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
   
  function showScore(score) {
      document.getElementById('score').innerHTML = 'Score :'+score;    
  }
   
  function showBestScore(score) {
      document.getElementById('bestscore').innerHTML = 'BestScore :'+score;    
  }
   
  // reset the game
  function resetGame() {
          snake.x = 160;
          snake.y = 160;
          snake.cells = [];
          snake.maxCells = 4;
          snake.dx = grid;
          snake.dy = 0;        
          score = 0;
          showScore(score);
          apple.x = getRandomInt(0, 25) * grid;
          apple.y = getRandomInt(0, 25) * grid;
  }

  function loop() {
    requestAnimationFrame(loop);
   
    // slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++count < 4) {
      return;
    }
   
    count = 0;
    context.clearRect(0,0,canvas.width,canvas.height);
   
    // move snake by it's velocity
    snake.x += snake.dx;
    snake.y += snake.dy;                 
    
    if ((snake.x < 0) || (snake.x >= canvas.width)) {
      resetGame();
      return;
    }
    
    if ((snake.y < 0) || (snake.y >= canvas.height)) {
      resetGame();
      return;
    }  
   
    // keep track of where snake has been. front of the array is always the head
    snake.cells.unshift({x: snake.x, y: snake.y});
   
    // remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }
   
    // draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);
   
    // draw snake one cell at a time
    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {    
      // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
      context.fillRect(cell.x, cell.y, grid-1, grid-1);  
   
      // snake ate apple
      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
   
        // canvas is 400x400 which is 25x25 grids 
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
        
        score ++;
        bestscore = Math.max(bestscore, score);
        showBestScore(bestscore);
        showScore(score);
      }
   
      // check collision with all cells after this one (modified bubble sort)
      for (var i = index + 1; i < snake.cells.length; i += 1) {      
        // snake occupies same space as a body part. reset game
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
           resetGame();
           return;
        }
      }
    });
  }

    // wrap snake position horizontally on edge of screen
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
      }
      else if (snake.x >= canvas.width) {
        snake.x = 0;
      }
      
      // wrap snake position vertically on edge of screen
      if (snake.y < 0) {
        snake.y = canvas.height - grid;
      }
      else if (snake.y >= canvas.height) {
        snake.y = 0;
      }