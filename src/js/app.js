
window['FLS'] = true;
import "../scss/style.scss";
import * as flsFunctions from "./files/functions.js";
flsFunctions.isWebp();
import * as flsForms from "./files/forms/forms.js";
import * as flsScroll from "./files/scroll/scroll.js";
import "./files/script.js";
////////////////////////////////////////////////
var button = document.getElementById("btn");
button.addEventListener("click", function () {
   disableButton();
});
function disableButton() {
   button.classList.add("disabled");
}


