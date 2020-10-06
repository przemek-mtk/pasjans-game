import { Game } from "./classes/Game.js";
import { Card } from "./classes/Card.js";
import { Movements } from "./classes/Movements.js";
import { Timer } from "./classes/Timer.js";
var Column;
(function (Column) {
    Column[Column["One"] = 0] = "One";
    Column[Column["Two"] = 1] = "Two";
    Column[Column["Three"] = 2] = "Three";
    Column[Column["Four"] = 3] = "Four";
    Column[Column["Five"] = 4] = "Five";
    Column[Column["Six"] = 5] = "Six";
    Column[Column["Seven"] = 6] = "Seven";
    Column[Column["ForSelection"] = 11] = "ForSelection";
    Column[Column["ForSelectionNext"] = 12] = "ForSelectionNext";
})(Column || (Column = {}));
// sprawdza czy przekazany obiekt ma jakiekolwiek property
const isEmpty = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};
let g = new Game();
g.startGame();
console.log(g.columns);
const btn = document.querySelector("#new-game");
btn.addEventListener("click", (e) => {
    // czyszczenie div#container
    document.querySelector("#container").innerHTML = "";
    // wybierz to albo to zakomentowane
    g = new Game();
    // g.columns.forEach(col => col.removeCards(0))
    g.startGame();
    t.resetTimer();
    m.resetState();
    foo();
});
const movements = document.querySelector("#movements");
const m = new Movements(movements);
const timer = document.querySelector("#timer");
const t = new Timer(timer);
t.startTimer();
const undo = document.querySelector("#undo");
undo === null || undo === void 0 ? void 0 : undo.addEventListener("click", (e) => {
    console.log("undo");
    let currentMovement = m.getMovements();
    let prevMovment = currentMovement - 1;
    g.getHistory(prevMovment);
    m.decrementState();
});
function foo() {
    //zapisuje początkowy stan gry
    g.setHistory(m.getMovements());
    const cards = Array.from(document.querySelectorAll(".card"));
    const forSelection = Array.from(document.querySelectorAll(".for-selection"));
    const repeat = document.querySelector(".repeat");
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    cards.forEach((element, index) => {
        let currentCard;
        // callback function dla window "mousemove"
        let cb;
        // kolumna z której przenosze karty
        let clickedColumn;
        // id karty którą przenoszę - potrzebne do ustawienia class visible dla elementu wyżej
        let clickedCardId;
        // karty które przenoszę - Card[]
        let belowClickedCard;
        let cardData;
        // ************************************************************************************************************************************************************************************
        // ************************************************************************************************************************************************************************************
        // ************************************************************************************************************************************************************************************
        element.addEventListener("mousedown", (e) => {
            // zapisuje kartę na której wykonuje "mousedown"
            // console.log("clickedColumn", clickedColumn)
            currentCard = g.findCard(element);
            // if (e.currentTarget!.classList.contains("moved")) {
            if (currentCard.isMoved) {
                console.log("mousedown");
                // console.log("YOU CLICKED:::", currentCard);
                // pozycja kursora w momencie mousedown
                let clickedPosition = {
                    x: 0,
                    y: 0,
                };
                // zapisanie pozycji kursora na karcie
                clickedPosition.x = element.offsetLeft - e.clientX;
                clickedPosition.y = element.offsetTop - e.clientY;
                // dane karty
                cardData = {
                    color: currentCard.color,
                    value: currentCard.value,
                };
                // kolumna w która klikam
                clickedColumn = g.getColumn(cardData);
                clickedCardId = clickedColumn.getCardId(cardData);
                belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
                belowClickedCard.forEach((c) => {
                    c.setPosition({ x: c.element.offsetLeft, y: c.element.offsetTop });
                });
                // console.log("HERE, THIS CARD YOU CLIKED ---> ", belowClickedCard);
                //ustawiam obecną pozycję kart jako początkową podczas przenoszenia
                // instantCards = belowClickedCard.map((c) => {
                //   return c.setPosition({ x: c.element.offsetLeft, y: c.element.offsetTop })
                // }
                // );
                // calback fn in window "move" event
                cb = (e) => belowClickedCard.forEach((c, i) => c.move(e, clickedPosition, i));
                window.addEventListener("mousemove", cb);
            }
        });
        // ************************************************************************************************************************************************************************************
        // ************************************************************************************************************************************************************************************
        // ************************************************************************************************************************************************************************************
        element.addEventListener("dblclick", (e) => {
            currentCard = g.findCard(element);
            if (
            // e.currentTarget!.classList.contains("moved") &&
            currentCard.isMoved
            // &&
            // mouseupCard === mousedownCard
            // clickedCardId !== undefined
            ) {
                // pobieram wszystkie kolumny które przyjmują karty
                // odwracam tabicę o zależy mi żeby karty w pierwszej kolejności trafiały do górnych boxów
                let x = g.columns.slice(0, 11).reverse();
                console.log("dbclick", currentCard);
                // to musi tu byś ze względu że podczas szybkiego klikania mouseup ustawi inną wartość
                // a podczas drugiego kliknięcia dal innej karty belowClickedCard zwraca złą wartość
                cardData = {
                    color: currentCard.color,
                    value: currentCard.value,
                };
                // kolumna w która klikam
                clickedColumn = g.getColumn(cardData);
                clickedCardId = clickedColumn.getCardId(cardData);
                belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
                belowClickedCard.forEach((c) => {
                    c.setPosition({ x: c.element.offsetLeft, y: c.element.offsetTop });
                });
                let targetCards = x.map((column) => {
                    if (column.direction === "down") {
                        return column.getLastCard();
                    }
                    else {
                        return column.getFirstCard();
                    }
                });
                // console.log("targetCards", targetCards);
                // sprawdzam do której kolumny pasuje karta
                const nextColumn = x.find((col) => col.checkColumnForElement(currentCard));
                console.log("next column is ", nextColumn);
                // nadaje odpowiednią posycję karcie
                if (nextColumn) {
                    const cardInColumn = (nextColumn === null || nextColumn === void 0 ? void 0 : nextColumn.direction) === "up"
                        ? nextColumn.getFirstCard()
                        : nextColumn.getLastCard();
                    // doaję, usuwam i usalam nową pozycję dla przeniesionych elementów
                    nextColumn.moveIfPossible(belowClickedCard, clickedColumn, clickedCardId);
                    console.log("hereeeeeeeeeeeee", currentCard.columnId < 11, clickedColumn.getLastCard(), clickedColumn.getLastCard().hasOwnProperty("color"));
                    // let newPosition;
                    // // box który przyjmuje kartę
                    // if (cardInColumn.isSpecial) {
                    //   newPosition = {
                    //     x: cardInColumn.position.x + 5,
                    //     y: cardInColumn.position.y + 5,
                    //   };
                    // } else {
                    //   //zwykła karta na która pasuje puszczna karta
                    //   newPosition = {
                    //     x: cardInColumn.position.x,
                    //     y: cardInColumn.position.y + 100,
                    //   };
                    // }
                    //usuwać chce ze wszystkich kolumn
                    // g.columns[currentCard.columnId].removeCards(currentCard.idInColumn);
                    // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty
                    //to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
                    if (g.columns[currentCard.columnId] ===
                        g.columns[Column.ForSelectionNext]) {
                        g.columns[currentCard.columnId].moveCards();
                    }
                    //tylko w kolumnach 0-10 chce zmieniać ostatnią kartę na visible i move
                    // if(currentCard.columnId > 0 && currentCard.columnId < 11) {
                    //   x[currentCard.columnId].getLastCard()?.setIsVisible(true);
                    //   x[currentCard.columnId].getLastCard()?.setIsMoved(true);
                    // }
                    // usuwam klasę(CSS) invisible i dodaję visible do ostatniego elementu DOM w columnie z której prznieniosłem karty
                    if (currentCard.columnId < 11 &&
                        clickedColumn.getLastCard() &&
                        clickedColumn.getLastCard().hasOwnProperty("color")) {
                        console.log("nie wykonuje");
                        // dopóki zwraca element
                        clickedColumn.getLastCard().setIsVisible(true);
                        clickedColumn.getLastCard().setIsMoved(true);
                    }
                    // currentCard.setPosition(newPosition).moveTo();
                    console.log("belowClickedCard", belowClickedCard);
                    // nextColumn?.addCard(belowClickedCard);
                    // belowClickedCard.forEach((c, i) =>
                    //   c
                    //     .setPosition({
                    //       x: newPosition.x,
                    //       y: newPosition.y + i * 100,
                    //     })
                    //     .moveTo()
                    // );
                    // warunek zapobiega dodawaniu do "od asa w górę" stosu kart
                    // if (
                    //   (nextColumn.direction === "up" &&
                    //     belowClickedCard.length === 1) ||
                    //     nextColumn.direction === "down"
                    // ) {
                    //   belowClickedCard.forEach((c, i) =>
                    //     c
                    //       .setPosition({
                    //         x: newPosition.x,
                    //         y: newPosition.y + i * 100,
                    //       })
                    //       .moveTo()
                    //   );
                    //   // sprawdzam czy kolumna jest direction: up -  jeśli tak to dodaj tylko gdy dodajesz jedną kartę
                    //   // dodaje te karty do kolumny i usuwma je z tej drugiej
                    //   // columnWitchGetCards.moveCards2(belowClickedCard, clickedColumn, clickedCardId)
                    //   // dodaje przenoszona karty do kolumny nad którą upuściłem
                    //   nextColumn.addCard(belowClickedCard);
                    //   // usuwam przeniesione karty ze starej kolumny
                    //   clickedColumn.removeCards(clickedCardId);
                    //   // console.log("clickedColumn", clickedColumn);
                    // } else {
                    //   belowClickedCard.forEach((c) => c.moveTo());
                    // }
                    // dodaje +1 do movements
                    m.incrementState();
                    g.setHistory(m.getMovements());
                    // sprawdzam czy skończyłeś już grę
                    g.gameResult();
                    g.autocompleteCards();
                }
            }
        });
        // ************************************************************************************************************************************************************************************
        // ************************************************************************************************************************************************************************************
        // ************************************************************************************************************************************************************************************
        element.addEventListener("mouseup", (e) => {
            // zapisuje kartę na której wykonuje "mouseup"
            // console.log("clickedColumn", clickedColumn)
            if (
            // e.currentTarget!.classList.contains("moved") &&
            currentCard.isMoved
            // &&
            // mouseupCard === mousedownCard
            // clickedCardId !== undefined
            ) {
                console.log("mouseup");
                window.removeEventListener("mousemove", cb);
                // pobieram ostatnie karty z kolumn
                // nie potrzebuje ostatnich dwóch kolumn -  nie chce dodawać tam kart
                let x = g.columns.slice(0, 11);
                let tomKoumneChcem = x.find(col => {
                    let elem;
                    if (col.direction === "down") {
                        elem = col.getLastCard();
                    }
                    else {
                        elem = col.getFirstCard();
                    }
                    let x;
                    if (elem instanceof Card) {
                        // deck[index] to obiekt z this.cards który odpowiada elementovi DOM na którym jest wykonywane zdarzenie "mouseup"
                        x = elem.checkIfFits(currentCard, col);
                    }
                    else {
                        x = new Card(elem.element, null, null, 0, 0, true).checkIfFits(currentCard, col);
                    }
                    if (x)
                        return col;
                });
                console.log("tomKoumneChcem", tomKoumneChcem);
                // let targetCards = x.map((column) => {
                //   if (column.direction === "down") {
                //     return column.getLastCard();
                //   } else {
                //     return column.getFirstCard();
                //   }
                // });
                // console.log("targetCards", targetCards);
                // // sprawdzam do której karty pasuje przenoszona karta - zwraca element DOM lub undefined
                // let cardAndColumnWhoWantsThisOtherCards = targetCards
                //   // .find((tCard, i) => new Card(tCard).checkIfFits(element, g.columns[i]));
                //   .reduce((acc, tCard, i) => {
                //     let x;
                //     if (tCard instanceof Card) {
                //       // deck[index] to obiekt z this.cards który odpowiada elementovi DOM na którym jest wykonywane zdarzenie "mouseup"
                //       x = tCard.checkIfFits(currentCard, g.columns[i]);
                //     } else {
                //       x = new Card(tCard.element, null, null, 0, 0, true).checkIfFits(
                //         currentCard,
                //         g.columns[i]
                //       );
                //     }
                //     console.log("xxxxxxxxxxxxxxxxxxxX", x);
                //     if (x) {
                //       return {
                //         column: g.columns[i],
                //       };
                //     }
                //     return acc;
                //   }, {});
                // console.log(
                //   "cardAndColumnWhoWantsThisOtherCards:::::::::::::",
                //   cardAndColumnWhoWantsThisOtherCards
                // );
                // let xd = x.map((column) => {
                //   if (column.direction === "down") {
                //     return column.getLastCard();
                //   } else {
                //     return column.getFirstCard();
                //   }
                // });
                // console.log("targetCards", targetCards);
                // sprawdzam do której kolumny pasuje karta
                // const nextColumn = x.find((col) =>
                //   currentCard.checkColumnForElement(col)
                // );
                // console.log("xdxdxdxdxdxdxd", nextColumn)
                // kolumna w która klikam
                clickedColumn = g.getColumn(cardData);
                clickedCardId = clickedColumn.getCardId(cardData);
                belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
                //pobieram kolumnę nad którą puszczasz kartę
                let columnWhichGetCards;
                if (tomKoumneChcem !== undefined) {
                    columnWhichGetCards = tomKoumneChcem;
                    // let newPosition: IPosition;
                    // // boxy do których rozdaje karty + boxy od asa w górę
                    // if (cardAndColumnWhoWantsThisOtherCards.card.isSpecial) {
                    //   newPosition = {
                    //     x: cardAndColumnWhoWantsThisOtherCards.card.position.x + 5,
                    //     y: cardAndColumnWhoWantsThisOtherCards.card.position.y + 5,
                    //   };
                    // } else {
                    //   //zwykła karta na która pasuje puszczna karta
                    //   newPosition = {
                    //     x: cardAndColumnWhoWantsThisOtherCards.card.position.x,
                    //     y: cardAndColumnWhoWantsThisOtherCards.card.position.y + 100, // +100 by obniżyć kartę by było widać tą pod spodem
                    //   };
                    // }
                    // metoda dodaje i odejmuje karty jeśli mogą zostać przeniesione
                    // jeśli nie karty wracają na swoją starą pozycję
                    columnWhichGetCards.moveIfPossible(belowClickedCard, clickedColumn, clickedCardId);
                    // warunek zapobiega dodawaniu do "od asa w górę" stosu kart
                    // if (
                    //   (columnWitchGetCards.direction === "up" &&
                    //     belowClickedCard.length === 1) ||
                    //   columnWitchGetCards.direction === "down"
                    // ) {
                    //   belowClickedCard.forEach((c, i) =>
                    //     c
                    //       .setPosition({
                    //         x: newPosition.x,
                    //         y: newPosition.y + i * 100,
                    //       })
                    //       .moveTo()
                    //   );
                    //   // sprawdzam czy kolumna jest direction: up -  jeśli tak to dodaj tylko gdy dodajesz jedną kartę
                    //   // dodaje te karty do kolumny i usuwma je z tej drugiej
                    //   // columnWitchGetCards.moveCards2(belowClickedCard, clickedColumn, clickedCardId)
                    //   // dodaje przenoszona karty do kolumny nad którą upuściłem
                    //   columnWitchGetCards.addCard(belowClickedCard);
                    //   // usuwam przeniesione karty ze starej kolumny
                    //   clickedColumn.removeCards(clickedCardId);
                    //   // console.log("clickedColumn", clickedColumn);
                    // } else {
                    //   belowClickedCard.forEach((c) => c.moveTo());
                    // }
                    // usuwam klasę(CSS) invisible i dodaję visible do ostatniego elementu DOM w columnie z której prznieniosłem karty
                    if (clickedColumn.getLastCard() &&
                        clickedColumn.getLastCard().hasOwnProperty("color")) {
                        // dopóki zwraca element
                        clickedColumn.getLastCard().setIsVisible(true);
                        clickedColumn.getLastCard().setIsMoved(true);
                    }
                    // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty
                    //to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
                    if (clickedColumn === g.columns[Column.ForSelectionNext]) {
                        clickedColumn.moveCards();
                    }
                    // dodaje +1 do movements
                    m.incrementState();
                    g.setHistory(m.getMovements());
                    // sprawdzam czy skończyłeś już grę
                    g.gameResult();
                    // możliwość autouzupełnienia kart
                    g.autocompleteCards();
                }
                else {
                    // prznieś karty do nowej pozycji - lub cofnij do starej pozycji
                    // instantCards.forEach((c) => c.moveTo());
                    // console.log("czy to przez to???");
                    // console.log(belowClickedCard);
                    belowClickedCard.forEach((c) => c.moveTo());
                }
            }
        });
    });
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    forSelection.forEach((element) => {
        element.addEventListener("click", (e) => {
            const curretnCardForSelection = g.findCard(element);
            console.log("jestem z for selection:", curretnCardForSelection);
            if (!(curretnCardForSelection === null || curretnCardForSelection === void 0 ? void 0 : curretnCardForSelection.isVisible)) {
                g.columns[Column.ForSelectionNext].getNextCardFrom(g.columns[Column.ForSelection]);
                // const lastCard: ICard = g.columns[Column.ForSelection].getLastCard();
                // // lastCard?.setIsVisible(true);
                // // lastCard?.setIsMoved(true);
                // // i dodaję ją do kolumny obok
                // g.columns[Column.ForSelectionNext].addCard([lastCard]);
                // // usuwam z forSelection ostatnią kartę -  to ta kliknięta
                // g.columns[Column.ForSelection].removeCards(-1);
                // // ruszam ostatnie 3 karty jakie trafiły do kolumny 12 (Column.ForSelectionNext)
                // g.columns[Column.ForSelectionNext].moveCards();
                // dodaje +1 do movements
                m.incrementState();
                let key = m.getMovements();
                // let columns = g.columns;
                g.setHistory(key);
                // const xxx =
            }
        });
    });
    // kolumny z kartami do doboru
    //cofanie kart z powrotem do kolumny forSelection
    repeat.addEventListener("click", (e) => {
        // g.columns[Column.ForSelection] kolumna 11
        // g.columns[Column.ForSelectionNext] kolumna 12
        // motoda moveCardsBack() przeniosi karty z kolumny 12 do 11
        g.columns[Column.ForSelection].moveCardsBack(g.columns[Column.ForSelectionNext]);
    });
}
foo();
