import { Game } from "./classes/Game.js";
import { Card } from "./classes/Card.js";
import { ICard } from "./interfaces/ICard.js";
import { IColumn } from "./interfaces/IColumn.js";
import { Movements } from "./classes/Movements.js";
import { Timer } from "./classes/Timer.js";

enum Column {
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  ForSelection = 11,
  ForSelectionNext = 12,
}

let g = new Game();
g.startGame();

console.log(g.columns);
// console.log("one:::: ", g.column[].getCards())
// console.log("two:::: ", g.column.two.getCards())kt
// console.log("three:::: ", g.column.three.getCards())
// console.log("four:::: ", g.column.four.getCards())
// console.log("five:::: ", g.column.five.getCards())
// console.log("six:::: ", g.column.six.getCards())
// console.log("seven:::: ", g.column.seven.getCards())

const btn = document.querySelector("#new-game") as HTMLButtonElement;
btn.addEventListener("click", (e: Event) => {
  // czyszczenie div#container
  document.querySelector("#container")!.innerHTML = "";

  // wybierz to albo to zakomentowane
  g = new Game();
  // g.columns.forEach(col => col.removeCards(0))
  g.startGame();
  t.resetTimer();
  m.resetState();
  foo();
});

const movements = document.querySelector("#movements") as HTMLDivElement;
const m = new Movements(movements);
// m.increaseState()

const timer = document.querySelector("#timer") as HTMLDivElement;
const t = new Timer(timer);
t.startTimer();


const undo = document.querySelector("#undo");
undo?.addEventListener("click", (e: Event) => {
  console.log("undo")
  let currentMovement = m.getMovements();
  let prevMovment = currentMovement - 1;
  g.getHistory(prevMovment);
  m.decrementState()
})
// console.log("one:::: ", g.columns[Column.One].getCards());
// console.log("two:::: ", g.columns[Column.Two].getCards());
// console.log("three:::: ", g.columns[Column.Three].getCards());
// console.log("four:::: ", g.columns[Column.Four].getCards());
// console.log("five:::: ", g.columns[Column.Five].getCards());
// console.log("six:::: ", g.columns[Column.Six].getCards());
// console.log("seven:::: ", g.columns[Column.Seven].getCards());
function foo() {

  //  rozłożenie kart na miejsca
  const deck = g.getCards();
  deck.forEach((x) => x.moveTo());

  
  
  //zapisuje początkowy stan gry
  g.setHistory(m.getMovements())

  const cards = Array.from(document.querySelectorAll(".card"));
  const forSelection = Array.from(document.querySelectorAll(".for-selection"));
  const repeat = document.querySelector(".repeat") as HTMLDivElement;

  // let x = g.columns; //.slice(0, 11);

  cards.forEach((element, index) => {
    // pozycja kursora w momencie mousedown
    let clickedPosition = {
      x: 0,
      y: 0,
    };

    // dane karty
    const cardData = {
      color: deck[index].color,
      value: deck[index].value,
    };

    // callback function dla window "mousemove"
    let cb: (e: Event) => void;

    // kolumna z której przenosze karty
    let clickedColumn: IColumn;
    // id karty którą przenoszę - potrzebne do ustawienia class visible dla elementu wyżej
    let clickedCardId: number;
    // karty które prznoszę - element Dom[]
    // let belowClickedCard;
    // karty które przenoszę - Card[]
    let instantCards: ICard[];

    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************

    element.addEventListener("mousedown", (e: Event) => {
      if (e.currentTarget!.classList.contains("moved")) {
        console.log("mousedown");

        console.log("YOU CLICKED:::", deck[index]);

        // zapisanie pozycji kursora na karcie
        clickedPosition.x = element.offsetLeft - e.clientX;
        clickedPosition.y = element.offsetTop - e.clientY;

        // kolumna w która klikam
        clickedColumn = g.getColumn(cardData);
        clickedCardId = clickedColumn.getCardId(cardData);
        let belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);

        //ustawiam obecną pozycję kart jako początkową podczas przenoszenia
        instantCards = belowClickedCard.map((c) => {

          return c.setPosition({ x: c.element.offsetLeft, y: c.element.offsetTop })
        }
        );
        // calback fn in window "move" event
        cb = (e) => instantCards.map((c, i) => c.move(e, clickedPosition, i));
        window.addEventListener("mousemove", cb);

        console.log("clickedCardId", clickedCardId);
        console.log("clickedColumn", clickedColumn);
      }
    });

    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************

    element.addEventListener("mouseup", (e: Event) => {
      if (
        e.currentTarget!.classList.contains("moved") &&
        clickedCardId !== undefined
      ) {
        console.log("mouseup");

        window.removeEventListener("mousemove", cb);

        // pobieram ostatnie karty z kolumn
        // nie potrzebuje ostatnich dwóch kolumn -  nie chce dodawać tam kart
        let x = g.columns.slice(0, 11);

        let targetCards = x.map((column) => column.getLastCard());
        console.log("targetCards",targetCards);
        // sprawdzam do której karty pasuje przenoszona karta - zwraca element DOM lub undefined
        let cardAndColumnWhoWantsThisOtherCards = targetCards
          // .find((tCard, i) => new Card(tCard).checkIfFits(element, g.columns[i]));
          .reduce((acc, tCard, i) => {
            let x;
            // console.log()
            if(tCard instanceof Card) {
              x = tCard.checkIfFits(element, g.columns[i]);
            } else {
              x = new Card(tCard.element, null, null, 0,0).checkIfFits(element, g.columns[i]);
            }
            
            
            // let x = new Card(tCard).checkIfFits(element, g.columns[i]);
            // console.log(x)
            if (x !== undefined) {
              return {
                element: tCard.element,
                columnNum: i,
                card: tCard
              };
            }
            return acc;
          }, {});

        // console.log(
        //   "cardAndColumnWhoWantsThisOtherCards",
        //   cardAndColumnWhoWantsThisOtherCards
        // );

        // sprawdzam czy któraś kolumna chce ta kartę
        // x - kolumny od 0-6
        // let nwm = x.find(col => col.nextCard.colors.includes(cardData.color) && col.nextCard.value === cardData.value);
        // nmw = columna na której puszczono kartę i ta kolumna jest w sanie ją przyjąć
        // console.log("nie wiem jak to opisć=======", nwm);
        // nwm?.addCard()

        /*
      // elementy które przyjmują karty od asa w górę
      let z = g.aboveAs.map(column => column.getLastCard());
      let boxWhoWantsAsUp = z.find(tCard => new Card(tCard).checkIfFits(element) === true);
      console.log("boxWhoWantsAsUp", boxWhoWantsAsUp);

      if(boxWhoWantsAsUp) {
        let newPosition: {x: number, y: number} = {x: boxWhoWantsAsUp.offsetLeft, y: boxWhoWantsAsUp.offsetTop};
        if(instantCards.length === 1) {
          instantCards.forEach((c, i) => c.setPosition({x: newPosition.x, y: newPosition.y})); 
        }

        let q = g.getColumn({color: boxWhoWantsAsUp.dataset.color, value: parseFloat(boxWhoWantsAsUp.dataset.value)}, "up")
        console.log("qq:::::::::::::", q);

        q.addCard(clickedColumn.getCardsBelow(clickedCardId));
        // usuwam przeniesione karty ze starej kolumny
        clickedColumn.removeCards(clickedCardId);
        // usuwam klasę(CSS) invisible i dodaję visible do ostatniego elementu DOM w columnie z której prznieniosłem karty
        if(clickedColumn.getLastCard()) { // dopóki zwraca element
          clickedColumn.getLastCard()!.classList.remove("invisible");
          clickedColumn.getLastCard()!.classList.add("visible");
          clickedColumn.getLastCard()!.classList.add("moved");
        }
        // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty
        //to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
        if(clickedColumn === g.columns[Column.ForSelectionNext]) {
          clickedColumn.moveCards();
        }

      }
*/

        let belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
        //te karty chce przenieść
        // let clickedColumn = g.getColumn(cardData);
        // console.log("clickedColumn", clickedColumn);
        // let clickedCardId = clickedColumn.getCardId(cardData);
        // console.log("clickedCardId", clickedCardId);
        // let belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
        // console.log("belowClickedCard", belowClickedCard);

        //pobieram kolumnę nad którą puszczasz kartę
        let columnWitchGetCards;
        if (cardAndColumnWhoWantsThisOtherCards.element) {
          // zmieniam kolumnę która ma te karty
          // columnWitchGetCards = g.getColumn({color: cardAndColumnWhoWantsThisOtherCards.dataset.color, value: parseFloat(cardAndColumnWhoWantsThisOtherCards.dataset.value)})
          columnWitchGetCards =
            g.columns[cardAndColumnWhoWantsThisOtherCards.columnNum];
          // console.log("columnWitchGetCards", columnWitchGetCards);

          // nowa pozycja dla kart
          let newPosition: { x: number; y: number };
          if (
            cardAndColumnWhoWantsThisOtherCards.element.classList.contains(
              "special"
            )
          ) {
            //ostatnie elementy w kolumnie -  boxy do których rozdaje karty
            newPosition = {
              x: cardAndColumnWhoWantsThisOtherCards.element.offsetLeft + 5,
              y: cardAndColumnWhoWantsThisOtherCards.element.offsetTop - 95,
            };
          } else if (
            cardAndColumnWhoWantsThisOtherCards.columnNum > 6 &&
            cardAndColumnWhoWantsThisOtherCards.columnNum < 11
          ) {
            console.log(
              "TUTAJ :",
              columnWitchGetCards.getCardsBelow(0)[0].offsetLeft,
              columnWitchGetCards.getCardsBelow(0)[0].offsetTop
            );
            newPosition = {
              x: columnWitchGetCards.getCardsBelow(0)[0].offsetLeft + 5,
              y: columnWitchGetCards.getCardsBelow(0)[0].offsetTop - 95,
            };
          } else {
            //zwykła karta na która pasuje puszczna karta
            newPosition = {
              x: cardAndColumnWhoWantsThisOtherCards.element.offsetLeft,
              y: cardAndColumnWhoWantsThisOtherCards.element.offsetTop,
            };
          }

          // console.log("instantCards", instantCards)
          // instantCards.forEach(c => c.moveTo());
          // instantCards.forEach((c, i) => c.setPosition({ x: s.x, y: s.y + i * 100}));
          // console.log("instantCards instantCards instantCards instantCards", instantCards)
          instantCards.forEach((c, i) =>
            c.setPosition({
              x: newPosition.x,
              y: newPosition.y + i * 100 + 100,
            })
          );
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

          // dodaje przenoszona karty do kolumny nad którą upuściłem
          columnWitchGetCards.addCard(belowClickedCard);
          // usuwam przeniesione karty ze starej kolumny
          clickedColumn.removeCards(clickedCardId);
          console.log("clickedColumn", clickedColumn)
          // usuwam klasę(CSS) invisible i dodaję visible do ostatniego elementu DOM w columnie z której prznieniosłem karty
          if (clickedColumn.getLastCard()) {
            // dopóki zwraca element
            clickedColumn.getLastCard().element.classList.remove("invisible");
            clickedColumn.getLastCard().element.classList.add("visible");
            clickedColumn.getLastCard().element.classList.add("moved");
          }
          // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty
          //to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
          if (clickedColumn === g.columns[Column.ForSelectionNext]) {
            clickedColumn.moveCards();
          }

          
          // ta nie chce być ostatnia - zmiana isLast na false
          const przykryta = cardAndColumnWhoWantsThisOtherCards.card;
          console.log("TUTAJ PATRZ TĄ PRZYKRYŁEŚ:::",przykryta)
          const odkryta = clickedColumn.getLastCard();
          console.log("TUTAJ PATRZ TĄ ODKRYŁEŚ:::",odkryta)

          if(przykryta.hasOwnProperty("color") && odkryta.hasOwnProperty("color")) {
            // przykryta.setIsLast(false);
            let id = przykryta.idInColumn;
            let idCol = przykryta.columnId;
            belowClickedCard.forEach((c,i) => {
              c.changeColumnId(idCol);
              c.changeIdInColumn(id + i + 1)
            })
            // przykryta.setIsLast(true);
            odkryta.setIsVisible();
          }
          // const ostatnie = g.columns.forEach(col => console.log("wtf", col.getLastCard().isLast = true))
          // po co mi isLast jak mam getLastInColumn dla column???????
          // console.log("")

          // dodaje +1 do movements
          m.incrementState();
          g.setHistory(m.getMovements());
        }

        // console.log("instantCards", instantCards)

        // prznieś karty do nowej pozycji - lub cofnij do starej pozycji
        instantCards.forEach((c) => c.moveTo());
        // console.log("instantCards instantCards instantCards instantCards", instantCards)

        // console.log(g.columns)

        // let s = g.getColumn({color: "kier", value: 12})
        // console.log(s);
        // let column = g.getColumn(cardData)
        // let mouseupInCard = column.getLastCard()
        // console.log("mouseupInCard", mouseupInCard)
        // console.log(g.columns);
      }
    });
  });
  // ************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************

  forSelection.forEach((element) => {
    element.addEventListener("click", (e: Event) => {
      if (element.classList.contains("invisible")) {
        const lastCard: ICard = g.columns[
          Column.ForSelection
        ].getLastCard();
        
        // console.log("LAST CARDDD", lastCard)
        
        lastCard?.element.classList.remove("invisible");
        lastCard?.element.classList.add("visible");

        // usuwam z forSelection ostatnią kartę -  to ta kliknięta
        g.columns[Column.ForSelection].removeCards(
          g.columns[Column.ForSelection].getCardsBelow(0).length - 1
        );
        // i dodaję ją do kolumny obok
        g.columns[Column.ForSelectionNext].addCard([lastCard]);
        // ruszam ostatnie 3 karty jakie trafiły do kolumny 12 (Column.ForSelectionNext)
        g.columns[Column.ForSelectionNext].moveCards();

        // dodaje +1 do movements
        m.incrementState();
        let key = m.getMovements();
        // let columns = g.columns;
        // console.log("g.columns g.columns g.columns g.columns ", [...columns] )
        g.setHistory(key)
        // const xxx = 
        // console.log("to jest zapisane w historiii::::", xxx)
        // console.log(
        //   "Column.ForSelection::: ",
        //   g.columns[Column.ForSelection].getCardsBelow(0)
        // );
        // console.log(
        //   "Column.ForSelectionNext::: ",
        //   g.columns[Column.ForSelectionNext].getCardsBelow(0)
        // );
      }
    });
  });

  //cofanie kart z powrotem do kolumny forSelection + cofanie style.left = 0px
  repeat.addEventListener("click", (e: Event) => {
    const cards = g.columns[Column.ForSelectionNext].getCardsBelow(0).reverse();
    cards.forEach((c) => {
      c.element.classList.add("invisible");
      c.element.classList.remove("visible");
      c.element.style.left = "0px";
    });

    // console.log("cards", cards);

    g.columns[Column.ForSelectionNext].removeCards(0);
    g.columns[Column.ForSelection].addCard(cards);
  });
}

foo();
