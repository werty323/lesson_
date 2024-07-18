import '../scss/style.scss';



import './files/script.js';



////////////////////////////////////////////////


const container = document.getElementById('container');

const nextMoveButton = document.getElementById('nextMoveBtn');

const resetButton = document.getElementById('resetBtn');

const scoreDisplay = document.getElementById('score');

const endGameMessage = document.getElementById('endGameMessage');



let score = 0;

let selectedBall = null;



const palette = {

   red: '#ff0000',

   blue: '#0000ff',

   green: '#00ff00',

   yellow: '#ffff00',

   purple: '#800080',

   orange: '#ffa500',

};



function getColorFromPalette(colorName) {

   if (palette.hasOwnProperty(colorName)) {

      return palette[colorName];

   } else {

      console.error('Ошибка: Нет такого цвета в палитре.');

      return null;

   }

}



function isCellEmpty(x, y) {

   if (x >= 0 && x < 10 && y >= 0 && y < 10) {

      const tile = document.getElementById('plate_' + x + '_' + y);

      return !tile.querySelector('.ball');

   } else {

      console.error('Ошибка: Неправильные координаты.');

      return null;

   }

}



function parseCoordinates(str) {

   const withoutPrefix = str.replace('plate_', '');

   const parts = withoutPrefix.split('_');

   const x = parseInt(parts[0], 10);

   const y = parseInt(parts[1], 10);

   return { x, y };

}



function toggleSelectedBall(event) {

   const ball = event.target;

   if (ball) {

      if (selectedBall === ball) {

         return;

      }

      if (selectedBall) {

         selectedBall.classList.remove('active');

      }

      selectedBall = ball;

      selectedBall.classList.add('active');

      const { x, y } = parseCoordinates(selectedBall.parentElement.id);

      const color = getBallAt(x, y);

      console.log('Выбран шар в клетке: ', x, y, color);

   }

}



function clickTile(event) {

   const tile = event.target;



   if (!tile.classList.contains('tile')) {

      return;

   }



   const { x, y } = parseCoordinates(tile.id);

   console.log('Выбрана клетка: ', tile.id);



   if (!selectedBall) {

      if (tile.querySelector('.ball')) {

         toggleSelectedBall({ target: tile.querySelector('.ball') });

      }

   } else {

      if (tile.querySelector('.ball')) {

         selectedBall.classList.remove('active');

         toggleSelectedBall({ target: tile.querySelector('.ball') });

      } else {

         moveActiveBallTo(x, y);

      }

   }

}
function moveActiveBallTo(x, y) {
   if (!selectedBall) {
      console.error('Ошибка: Шар не выбран для перемещения.');
      return;
   }
   if (!isCellEmpty(x, y)) {
      console.error('Ошибка: Указанная клетка не пуста.');
      return;
   }

   const { x: fromX, y: fromY } = parseCoordinates(selectedBall.parentElement.id);
   console.log('Текущие координаты шара:', fromX, fromY);

   const path = findWay(fromX, fromY, x, y);
   if (path === null) {
      console.log("Путь не найден");
      return;
   }
   console.log('Найденный путь:', path);

   applySteps(path);

   const tile = document.getElementById('plate_' + x + '_' + y);
   selectedBall.parentElement.removeChild(selectedBall);
   tile.appendChild(selectedBall);
   selectedBall.classList.remove('active');
   selectedBall = null;

   const matches = checkForMatchesAt(x, y);
   if (matches === 0) {
      placeNewBalls(3);
      if (!isPlaneHasEmptyCells()) {
         finish();
      }
   } else {
      if (!isPlaneHasEmptyCells()) {
         finish();
      }
   }
}

function setBallAt(x, y, colorName) {

   const tile = document.getElementById('plate_' + x + '_' + y);

   const existingBall = tile.querySelector('.ball');

   if (existingBall) {

      existingBall.remove();

   }


   const ball = document.createElement('div');

   ball.className = 'ball';

   ball.style.backgroundColor = getColorFromPalette(colorName);

   ball.addEventListener('click', toggleSelectedBall);

   tile.appendChild(ball);
}



// Функция преобразования RGB rgb(255, 0, 0) в HEX #ff0000

function rgb2hex(rgb) {

   rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

   function hex(x) {

      return ('0' + parseInt(x).toString(16)).slice(-2);

   }

   return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);

}



function getBallAt(x, y) {

   const tile = document.getElementById('plate_' + x + '_' + y);

   const ball = tile.querySelector('.ball');



   if (ball) {

      for (let color in palette) {

         if (rgb2hex(ball.style.backgroundColor) === palette[color]) {

            return color;

         }

      }

   }

   return false;

}



function isPlaneHasEmptyCells() {

   for (let i = 0; i < 10; i++) {

      for (let j = 0; j < 10; j++) {

         if (isCellEmpty(i, j)) {

            return true;

         }

      }

   }

   return false;

}



function addBall() {

   if (!isPlaneHasEmptyCells()) {

      return false;

   }

   let x, y;

   do {

      x = Math.floor(Math.random() * 10);

      y = Math.floor(Math.random() * 10);

   } while (!isCellEmpty(x, y));

   const colors = Object.keys(palette);

   const randomColor = colors[Math.floor(Math.random() * colors.length)];

   setBallAt(x, y, randomColor);

   return true;

}



function resetScore() {

   score = 0;

   updateScoreDisplay();

}



function checkHorizontalLine(x, y, color) {

   let line = [{ x, y }];

   let left = x - 1;

   let right = x + 1;



   while (left >= 0 && getBallAt(left, y) === color) {

      line.push({ x: left, y });

      left--;

   }



   while (right < 10 && getBallAt(right, y) === color) {

      line.push({ x: right, y });

      right++;

   }



   return line;

}



function checkVerticalLine(x, y, color) {

   let line = [{ x, y }];

   let up = y - 1;

   let down = y + 1;



   while (up >= 0 && getBallAt(x, up) === color) {

      line.push({ x, y: up });

      up--;

   }



   while (down < 10 && getBallAt(x, down) === color) {

      line.push({ x, y: down });

      down++;

   }



   return line;

}



function checkDiagonalLine(x, y, color, dx, dy) {

   let line = [{ x, y }];

   let nx = x + dx;

   let ny = y + dy;



   while (nx >= 0 && nx < 10 && ny >= 0 && ny < 10 && getBallAt(nx, ny) === color) {

      line.push({ x: nx, y: ny });

      nx += dx;

      ny += dy;

   }



   nx = x - dx;

   ny = y - dy;

   while (nx >= 0 && nx < 10 && ny >= 0 && ny < 10 && getBallAt(nx, ny) === color) {

      line.push({ x: nx, y: ny });

      nx -= dx;

      ny -= dy;

   }



   return line;

}



function checkForMatchesAt(x, y) {

   const color = getBallAt(x, y);



   if (!color) return;



   const horizontalLine = checkHorizontalLine(x, y, color);

   const verticalLine = checkVerticalLine(x, y, color);

   const diagonalLine1 = checkDiagonalLine(x, y, color, 1, 1);

   const diagonalLine2 = checkDiagonalLine(x, y, color, 1, -1);



   let totalMatches = 0;



   if (horizontalLine.length >= 5) {

      totalMatches += horizontalLine.length;

      clearLine(horizontalLine);

   }

   if (verticalLine.length >= 5) {

      totalMatches += verticalLine.length;

      clearLine(verticalLine);

   }

   if (diagonalLine1.length >= 5) {

      totalMatches += diagonalLine1.length;

      clearLine(diagonalLine1);

   }

   if (diagonalLine2.length >= 5) {

      totalMatches += diagonalLine2.length;

      clearLine(diagonalLine2);

   }



   if (totalMatches > 0) {

      addScore(totalMatches * 2);

   }

   return totalMatches;

}



function clearLine(line) {

   line.forEach(({ x, y }) => {

      const tile = document.getElementById(`plate_${x}_${y}`);

      const ball = tile.querySelector('.ball');

      if (ball) {

         ball.remove();

      }

   });

}



function addScore(value) {

   score += value;

   updateScoreDisplay();

}



function updateScoreDisplay() {

   scoreDisplay.textContent = 'Счет: ' + score;

}



function reset() {

   resetScore();

   container.innerHTML = '';

   createGrid();

   endGameMessage.classList.add('hidden');

   nextMoveButton.disabled = false;

   const balls = document.querySelectorAll('.ball');

   balls.forEach((ball) => ball.remove());

   placeNewBalls(5);

}



function nextMove() {

   placeNewBalls(3);

}


function placeNewBalls(count) {

   for (let i = 0; i < count; i++) {

      if (!addBall()) {

         return;

      }
      for (let x = 0; x < 10; x++) {

         for (let y = 0; y < 10; y++) {

            checkForMatchesAt(x, y);

         }
      }
   }
}




function finish() {

   endGameMessage.textContent = `Игра окончена. Вы набрали ${score} очков`;

   endGameMessage.classList.remove('hidden');

   nextMoveButton.disabled = true;

}

function nextMoveHandler() {

   audio2.play();

   nextMove();
}

function resetHandler() {

   audio1.play();

   reset();
}


nextMoveButton.addEventListener('click', nextMoveHandler);

resetButton.addEventListener('click', resetHandler);
function createGrid() {
   for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
         const tile = document.createElement('div');

         tile.className = 'tile';

         tile.id = 'plate_' + j + '_' + i;

         tile.style.left = j * 40 + 'px';

         tile.style.top = i * 40 + 'px';

         container.appendChild(tile);

         tile.addEventListener('click', clickTile);

         const box = document.createElement('div');

         box.className = 'box';

         tile.appendChild(box);

         tile.addEventListener('click', clickTile);
      }
   }
}




function ClearStepAnimation() {

   var elements = document.querySelectorAll('.step-active');

   elements.forEach(function (element) {

      element.classList.remove('step-active');

   });
}

function applySteps(moves) {

   moves.forEach(function (move) {

      const [x, y] = move.split('_');

      const tile = document.getElementById('plate_' + x + '_' + y);


      if (tile) {

         const box = tile.querySelector('.box');

         box.classList.add('step-active');

      }
   });
   setTimeout(ClearStepAnimation, 1000);
}

function findWay(startX, startY, endX, endY) {
   let path = [];


   if (startX <= endX) {
      for (let x = startX; x <= endX; x++) {
         path.push([x, startY]);
      }
   } else {
      for (let x = startX; x >= endX; x--) {
         path.push([x, startY]);
      }
   }


   if (startY <= endY) {
      for (let y = startY + 1; y <= endY; y++) {
         path.push([endX, y]);
      }
   } else {
      for (let y = startY - 1; y >= endY; y--) {
         path.push([endX, y]);
      }
   }

   return path.length > 0 ? path : null;
}

createGrid();

reset();