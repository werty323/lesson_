
window['FLS'] = true;
import "../scss/style.scss";
import * as flsFunctions from "./files/functions.js";
flsFunctions.isWebp();
import * as flsForms from "./files/forms/forms.js";
import * as flsScroll from "./files/scroll/scroll.js";
import "./files/script.js";
////////////////////////////////////////////////
let num = 10;
console.log(num);

let partOne = `hello,`;
let partTwo = `world`;
let say = partOne + partTwo;
console.log(say);

/*let numOne = 15;
let numTwo = 20;
if (numOne > numTwo) {
   console.log
      ("numOne больше numTwo")
      ;
}
else { console.log("numTwo больше numOne"); }
*/

let someNum = 10;
let someString;
if (10 > 1) {
   someString = "Hello";
}
console.log(someString);


function getSumm(numOne, numTwo) {
   return numOne + numTwo;
}
console.log(getSumm(200, 2));