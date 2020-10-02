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
    cards.forEach((element, index) => {
        // pozycja kursora w momencie mousedown
        let clickedPosition = {
            x: 0,
            y: 0,
        };
        const currentCard = g.findCard(element);
        // dane karty
        const cardData = {
            color: currentCard.color,
            value: currentCard.value,
        };
        // callback function dla window "mousemove"
        let cb;
        // kolumna z której przenosze karty
        let clickedColumn;
        // id karty którą przenoszę - potrzebne do ustawienia class visible dla elementu wyżej
        let clickedCardId;
        // karty które przenoszę - Card[]
        let belowClickedCard;
        // ************************************************************************************************************************************************************************************
        // ************************************************************************************************************************************************************************************
        // ************************************************************************************************************************************************************************************
        element.addEventListener("mousedown", (e) => {
            if (e.currentTarget.classList.contains("moved")) {
                console.log("mousedown");
                console.log("YOU CLICKED:::", currentCard);
                // zapisanie pozycji kursora na karcie
                clickedPosition.x = element.offsetLeft - e.clientX;
                clickedPosition.y = element.offsetTop - e.clientY;
                // kolumna w która klikam
                clickedColumn = g.getColumn(cardData);
                clickedCardId = clickedColumn.getCardId(cardData);
                belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
                belowClickedCard.forEach((c) => {
                    c.setPosition({ x: c.element.offsetLeft, y: c.element.offsetTop });
                });
                console.log("HERE, THIS CARD YOU CLIKED ---> ", belowClickedCard);
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
        element.addEventListener("mouseup", (e) => {
            if (e.currentTarget.classList.contains("moved") &&
                clickedCardId !== undefined) {
                console.log("mouseup");
                window.removeEventListener("mousemove", cb);
                // pobieram ostatnie karty z kolumn
                // nie potrzebuje ostatnich dwóch kolumn -  nie chce dodawać tam kart
                let x = g.columns.slice(0, 11);
                let targetCards = x.map((column) => {
                    if (column.direction === "down") {
                        return column.getLastCard();
                    }
                    else {
                        return column.getFirstCard();
                    }
                });
                console.log("targetCards", targetCards);
                // sprawdzam do której karty pasuje przenoszona karta - zwraca element DOM lub undefined
                let cardAndColumnWhoWantsThisOtherCards = targetCards
                    // .find((tCard, i) => new Card(tCard).checkIfFits(element, g.columns[i]));
                    .reduce((acc, tCard, i) => {
                    let x;
                    if (tCard instanceof Card) {
                        // deck[index] to obiekt z this.cards który odpowiada elementovi DOM na którym jest wykonywane zdarzenie "mouseup"
                        x = tCard.checkIfFits(currentCard, g.columns[i]);
                    }
                    else {
                        x = new Card(tCard.element, null, null, 0, 0, true).checkIfFits(currentCard, g.columns[i]);
                    }
                    if (x !== undefined) {
                        return {
                            column: g.columns[i],
                            card: tCard,
                        };
                    }
                    return acc;
                }, {});
                console.log("cardAndColumnWhoWantsThisOtherCards:::::::::::::", cardAndColumnWhoWantsThisOtherCards);
                //pobieram kolumnę nad którą puszczasz kartę
                let columnWitchGetCards;
                if (!isEmpty(cardAndColumnWhoWantsThisOtherCards)) {
                    columnWitchGetCards = cardAndColumnWhoWantsThisOtherCards.column;
                    let newPosition;
                    // boxy do których rozdaje karty + boxy od asa w górę
                    if (cardAndColumnWhoWantsThisOtherCards.card.isSpecial) {
                        newPosition = {
                            x: cardAndColumnWhoWantsThisOtherCards.card.position.x + 5,
                            y: cardAndColumnWhoWantsThisOtherCards.card.position.y + 5,
                        };
                    }
                    else {
                        //zwykła karta na która pasuje puszczna karta
                        newPosition = {
                            x: cardAndColumnWhoWantsThisOtherCards.card.position.x,
                            y: cardAndColumnWhoWantsThisOtherCards.card.position.y + 100,
                        };
                    }
                    belowClickedCard.forEach((c, i) => c
                        .setPosition({
                        x: newPosition.x,
                        y: newPosition.y + i * 100,
                    })
                        .moveTo());
                    // dodaje przenoszona karty do kolumny nad którą upuściłem
                    columnWitchGetCards.addCard(belowClickedCard);
                    // usuwam przeniesione karty ze starej kolumny
                    clickedColumn.removeCards(clickedCardId);
                    console.log("clickedColumn", clickedColumn);
                    // usuwam klasę(CSS) invisible i dodaję visible do ostatniego elementu DOM w columnie z której prznieniosłem karty
                    if (clickedColumn.getLastCard() &&
                        clickedColumn.getLastCard().hasOwnProperty("color")) {
                        // dopóki zwraca element
                        clickedColumn.getLastCard().setIsVisible(true);
                    }
                    // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty
                    //to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
                    if (clickedColumn === g.columns[Column.ForSelectionNext]) {
                        clickedColumn.moveCards();
                    }
                    // dodaje +1 do movements
                    m.incrementState();
                    g.setHistory(m.getMovements());
                }
                else {
                    // prznieś karty do nowej pozycji - lub cofnij do starej pozycji
                    // instantCards.forEach((c) => c.moveTo());
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
            if (element.classList.contains("invisible")) {
                const lastCard = g.columns[Column.ForSelection].getLastCard();
                lastCard === null || lastCard === void 0 ? void 0 : lastCard.setIsVisible(true);
                // i dodaję ją do kolumny obok
                g.columns[Column.ForSelectionNext].addCard([lastCard]);
                // usuwam z forSelection ostatnią kartę -  to ta kliknięta
                g.columns[Column.ForSelection].removeCards(-1);
                // ruszam ostatnie 3 karty jakie trafiły do kolumny 12 (Column.ForSelectionNext)
                g.columns[Column.ForSelectionNext].moveCards();
                // dodaje +1 do movements
                m.incrementState();
                let key = m.getMovements();
                // let columns = g.columns;
                g.setHistory(key);
                // const xxx =
            }
        });
    });
    //cofanie kart z powrotem do kolumny forSelection + cofanie style.left = 0px
    repeat.addEventListener("click", (e) => {
        const cards = g.columns[Column.ForSelectionNext].getCardsBelow(0).reverse();
        cards.forEach((c) => {
            c.setPosition({ x: 0, y: 0 }).moveTo();
            c.setIsVisible(false);
        });
        g.columns[Column.ForSelectionNext].removeCards(0);
        g.columns[Column.ForSelection].addCard(cards);
    });
}
foo();
