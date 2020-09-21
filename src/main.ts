import { Game } from "./classes/Game.js";
import { Card } from "./classes/Card.js";

enum Column {
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
}

let g = new Game();
g.startGame();

// console.log("one:::: ", g.column[].getCards())
// console.log("two:::: ", g.column.two.getCards())
// console.log("three:::: ", g.column.three.getCards())
// console.log("four:::: ", g.column.four.getCards())
// console.log("five:::: ", g.column.five.getCards())
// console.log("six:::: ", g.column.six.getCards())
// console.log("seven:::: ", g.column.seven.getCards())

// console.log("one:::: ", g.columns[Column.One].getCards());
// console.log("two:::: ", g.columns[Column.Two].getCards());
// console.log("three:::: ", g.columns[Column.Three].getCards());
// console.log("four:::: ", g.columns[Column.Four].getCards());
// console.log("five:::: ", g.columns[Column.Five].getCards());
// console.log("six:::: ", g.columns[Column.Six].getCards());
// console.log("seven:::: ", g.columns[Column.Seven].getCards());

const cards = document.querySelectorAll(".card");

cards.forEach((element) => {
  // pozycja kursora w momencie mousedown
  let clickedPosition = {
    x: 0,
    y: 0,
  };

  // dane karty
  const cardData = {
    color: element.dataset.color,
    value: parseFloat(element.dataset.value),
  };


  // ************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************

  element.addEventListener("mousedown", (e: Event) => {
    if (e.currentTarget!.classList.contains("visible")) {
      console.log("mousedown");

      // zapisanie pozycji kursora na karcie
      clickedPosition.x = element.offsetLeft - e.clientX;
      clickedPosition.y = element.offsetTop - e.clientY;

      // currentCard = new Card(element);
      // console.log(currentCard.move())

      // window.addEventListener("mousemove", move);
      let clickedColumn = g.getColumn(cardData);
      console.log(clickedColumn);
      let clickedColumnId = clickedColumn.getCardId(cardData);
      console.log(clickedColumnId);
      let belowClickedCard = clickedColumn.getCards(clickedColumnId);
      console.log(belowClickedCard);

      // let clickedCartId = clickedColumn.getCardId(cardData)
      // console.log(clickedCartId)
    }
  });

  // ************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************

  element.addEventListener("mouseup", (e: Event) => {
    if (e.currentTarget!.classList.contains("visible")) {
      console.log("mouseup");

      // window.removeEventListener("mousemove", move)
    }
  });
});
