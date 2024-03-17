
window['FLS'] = true;
import "../scss/style.scss";
import * as flsFunctions from "./files/functions.js";
flsFunctions.isWebp();
import * as flsForms from "./files/forms/forms.js";
import * as flsScroll from "./files/scroll/scroll.js";
import "./files/script.js";
////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
   const container = document.getElementById('container');
   const resetButton = document.getElementById('btn');

   function createGrid() {
      container.innerHTML = '';

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

   function addBall() {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const tile = document.getElementById('plate_' + x + '_' + y);

      if (!tile.querySelector('.ball')) {
         const ball = document.createElement('div');
         ball.className = 'ball';
         ball.id = 'ball_' + x + '_' + y;
         ball.style.backgroundColor = getRandomColor();
         ball.style.left = '9px';
         ball.style.top = '9px';
         tile.appendChild(ball);
      } else {
         addBall();
      }
   }

   function reset() {
      createGrid();
      for (let i = 0; i < 5; i++) {
         addBall();
      }
   }

   function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
         color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
   }


   createGrid();

   resetButton.addEventListener('click', reset);
});


