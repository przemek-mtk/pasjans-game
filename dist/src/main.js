import { Game } from "./classes/Game.js";
import { Card } from "./classes/Card.js";
var Column;
(function (Column) {
    Column[Column["One"] = 0] = "One";
    Column[Column["Two"] = 1] = "Two";
    Column[Column["Three"] = 2] = "Three";
    Column[Column["Four"] = 3] = "Four";
    Column[Column["Five"] = 4] = "Five";
    Column[Column["Six"] = 5] = "Six";
    Column[Column["Seven"] = 6] = "Seven";
})(Column || (Column = {}));
let g = new Game();
g.startGame();
// console.log("one:::: ", g.column[].getCards())
// console.log("two:::: ", g.column.two.getCards())
// console.log("three:::: ", g.column.three.getCards())
// console.log("four:::: ", g.column.four.getCards())
// console.log("five:::: ", g.column.five.getCards())
// console.log("six:::: ", g.column.six.getCards())
// console.log("seven:::: ", g.column.seven.getCards())
console.log("one:::: ", g.column[Column.One].getCards());
console.log("two:::: ", g.column[Column.Two].getCards());
console.log("three:::: ", g.column[Column.Three].getCards());
console.log("four:::: ", g.column[Column.Four].getCards());
console.log("five:::: ", g.column[Column.Five].getCards());
console.log("six:::: ", g.column[Column.Six].getCards());
console.log("seven:::: ", g.column[Column.Seven].getCards());
const cards = document.querySelectorAll(".card");
cards.forEach(element => {
    // pozycja kursora w momencie mousedown
    let clickedPosition = {
        x: 0, y: 0
    };
    // dane karty
    const cardData = {
        color: element.dataset.color,
        value: element.dataset.value
    };
    console.log(element);
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    element.addEventListener("mousedown", (e) => {
        if (e.currentTarget.classList.contains("visible")) {
            console.log("mousedown");
            // zapisanie pozycji kursora na karcie
            clickedPosition.x = element.offsetLeft - e.clientX;
            clickedPosition.y = element.offsetTop - e.clientY;
            const card = new Card(cardData.color, cardData.value);
        }
    });
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    element.addEventListener("mouseup", (e) => {
        if (e.currentTarget.classList.contains("visible")) {
            console.log("mouseup");
        }
    });
});
