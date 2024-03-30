window['FLS'] = true;
import '../scss/style.scss';
import * as flsFunctions from './files/functions.js';
flsFunctions.isWebp();
import * as flsForms from './files/forms/forms.js';
import * as flsScroll from './files/scroll/scroll.js';
import './files/script.js';
////////////////////////////////////////////////
const container = document.getElementById('container');
const nextMoveButton = document.getElementById('nextMoveBtn');
const resetButton = document.getElementById('resetBtn');
const scoreDisplay = document.getElementById('score');
const endGameMessage = document.getElementById('endGameMessage');

let score = 0;
const palette = {
   "red": "#ff0000",
   "blue": "#0000ff",
   "green": "#00ff00",
   "yellow": "#ffff00",
   "purple": "#800080",
   "orange": "#ffa500"
};
function getColorFromPalette(colorName) {
   if (palette.hasOwnProperty(colorName)) {
      return palette[colorName];
   } else {
      console.error("Ошибка: Нет такого цвета в палитре.");
      return null;
   }
}

function isCellEmpty(x, y) {
   if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      const tile = document.getElementById('plate_' + x + '_' + y);
      return !tile.querySelector('.ball');
   } else {
      console.error("Ошибка: Неправильные координаты.");
      return null;
   }
}

function setBallAt(x, y, colorName) {
   const tile = document.getElementById('plate_' + x + '_' + y);
   tile.innerHTML = '';
   const ball = document.createElement('div');
   ball.className = 'ball';
   ball.style.backgroundColor = getColorFromPalette(colorName);
   tile.appendChild(ball);
}

function getBallAt(x, y) {
   const tile = document.getElementById('plate_' + x + '_' + y);
   const ball = tile.querySelector('.ball');
   if (ball) {
      for (let color in palette) {
         if (ball.style.backgroundColor === palette[color]) {
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

function addScore(value) {
   score += value;
   updateScoreDisplay();
}

function updateScoreDisplay() {
   scoreDisplay.textContent = 'Очки: ' + score;
}

function reset() {
   resetScore();
   container.innerHTML = '';
   createGrid();
   endGameMessage.classList.add('hidden');
   nextMoveButton.disabled = false

   const balls = document.querySelectorAll('.ball');
   balls.forEach(ball => ball.remove());
}



function nextMove() {
   for (let i = 0; i < 5; i++) {
      if (!addBall()) {
         finish();
         return;
      }
      addScore(10);
   }
}

function finish() {
   endGameMessage.textContent = `Игра окончена. Вы набрали ${score} очков`;
   endGameMessage.classList.remove('hidden');
   nextMoveButton.disabled = true;
}

function createGrid() {
   for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
         const tile = document.createElement('div');
         tile.className = 'tile';
         tile.id = 'plate_' + i + '_' + j;
         tile.style.left = (j * 40) + 'px';
         tile.style.top = (i * 40) + 'px';
         container.appendChild(tile);
      }
   }
}
nextMoveButton.addEventListener('click', nextMove);
resetButton.addEventListener('click', reset);


createGrid();
