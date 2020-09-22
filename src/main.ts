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
// console.log("two:::: ", g.column.two.getCards())kt
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

const cards = Array.from(document.querySelectorAll(".card"));

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

  // callback function dla window "mousemove"
  let cb: (e: Event) => void;

  // karty które przenoszę
  let instantCards;

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

      let clickedColumn = g.getColumn(cardData);
      // console.log("clickedColumn", clickedColumn);
      let clickedCardId = clickedColumn.getCardId(cardData);
      // console.log("clickedCardId", clickedCardId);
      let belowClickedCard = clickedColumn.getCards(clickedCardId);
      // console.log("belowClickedCard", belowClickedCard);
      instantCards = belowClickedCard.map((c) => new Card(c).setPosition({x: c.offsetLeft, y: c.offsetTop}))
      console.log("instantCards:::: ", instantCards)

      cb = (e) => belowClickedCard.map(c => new Card(c)).map((c,i) => c.move(e, clickedPosition, i))
      window.addEventListener("mousemove", cb);

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

      window.removeEventListener("mousemove", cb)

      let targetCards = g.columns.map(column => column.getLastCard());
      console.log("targetCards",targetCards);
      // ZWRACA ELEMENT DO KTÓREGO PASUJĄ ALBO UNDEFINED
      let cardWhoWantsThisOtherCards = targetCards.find(tCard => new Card(tCard).checkIfFits(element) === true);
      console.log("cardWhoWantsThisOtherCards", cardWhoWantsThisOtherCards);

      //pobieram kolumnę nad którą puszczasz kartę
      let columnWitchGetCards;
      if(cardWhoWantsThisOtherCards) {
        
      }


      //te karty chce przenieść
      let clickedColumn = g.getColumn(cardData);
      console.log("clickedColumn", clickedColumn);
      let clickedCardId = clickedColumn.getCardId(cardData);
      console.log("clickedCardId", clickedCardId);
      let belowClickedCard = clickedColumn.getCards(clickedCardId);
      console.log("belowClickedCard", belowClickedCard);

      if(cardWhoWantsThisOtherCards) {
        // przenieś je tu
        const s = {x: cardWhoWantsThisOtherCards.offsetLeft, y: cardWhoWantsThisOtherCards.offsetTop};

        console.log("instantCards", instantCards)
        // instantCards.forEach(c => c.moveTo());
        // instantCards.forEach((c, i) => c.setPosition({ x: s.x, y: s.y + i * 100})); 
        instantCards.forEach((c, i) => c.setPosition({x: s.x, y: s.y + i * 100 + 100})); 
        // belowClickedCard.forEach((e,i) => {
        //   e.style.top = s.y + i * 100 + 100  + "px";
        //   e.style.left = s.x + "px";
        // })
      // } else {
      //   // niestety chłopaki wracacie do domu
      //   // belowClickedCard.forEach((e,i) => {
      //   //   e.style.top = s.y + i * 100 + 100  + "px";
      //   //   e.style.left = s.x + "px";
      //   // })

      // zmieniam kolumnę która ma te karty
        columnWitchGetCards = g.getColumn({color: cardWhoWantsThisOtherCards.dataset.color, value: parseFloat(cardWhoWantsThisOtherCards.dataset.value)})
        console.log("columnWitchGetCards", columnWitchGetCards);
        columnWitchGetCards.addCard(belowClickedCard);
        clickedColumn.removeCards(clickedCardId)
      }

      console.log("instantCards", instantCards)
      // przenieś karty do odpowiedniego miesca  
      instantCards.forEach(c => c.moveTo());

      console.log(g.columns)

      // let s = g.getColumn({color: "kier", value: 12})
      // console.log(s);
      // let column = g.getColumn(cardData)
      // let mouseupInCard = column.getLastCard()
      // console.log("mouseupInCard", mouseupInCard)

    }
  });
});