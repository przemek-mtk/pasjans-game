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
const container = document.querySelector("#container");
let g = new Game(container);
g.startGame();
console.log(g.columns);
const btn = document.querySelector("#new-game");
btn.addEventListener("click", (e) => {
    // czyszczenie div#container
    document.querySelector("#container").innerHTML = "";
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
                clickedColumn = g.getColumnByIndex(currentCard.columnId);
                clickedCardId = currentCard.idInColumn;
                belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
                belowClickedCard.forEach((c) => {
                    c.setPosition({ x: c.element.offsetLeft, y: c.element.offsetTop });
                });
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
            if (currentCard.isMoved) {
                // pobieram wszystkie kolumny które przyjmują karty
                // odwracam tabicę o zależy mi żeby karty w pierwszej kolejności trafiały do górnych boxów
                let x = g.getColumns(11).reverse();
                console.log("dbclick", currentCard);
                // to musi tu byś ze względu że podczas szybkiego klikania mouseup ustawi inną wartość
                // a podczas drugiego kliknięcia dal innej karty belowClickedCard zwraca złą wartość
                cardData = {
                    color: currentCard.color,
                    value: currentCard.value,
                };
                // kolumna w która klikam
                clickedColumn = g.getColumnByIndex(currentCard.columnId);
                clickedCardId = currentCard.idInColumn;
                belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
                belowClickedCard.forEach((c) => {
                    c.setPosition({ x: c.element.offsetLeft, y: c.element.offsetTop });
                });
                // sprawdzam do której kolumny pasuje karta
                const nextColumn = x.find((col) => col.checkColumnForElement(currentCard));
                console.log("next column is ", nextColumn);
                // nadaje odpowiednią posycję karcie
                if (nextColumn) {
                    // dodaję, usuwam i usalam nową pozycję dla przeniesionych elementów
                    nextColumn.moveIfPossible(belowClickedCard, clickedColumn, clickedCardId);
                    //usuwać chce ze wszystkich kolumn
                    // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty
                    //to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
                    if (clickedColumn === g.getColumnByIndex(Column.ForSelectionNext)) {
                        clickedColumn.moveCards();
                    }
                    // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty
                    // to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
                    if (clickedColumn === g.getColumnByIndex(Column.ForSelectionNext)) {
                        console.log("to nie działa?!?!??!?!?!??????????????????????????????????????????????????");
                        clickedColumn.moveCards();
                    }
                    if (currentCard.columnId < 11 &&
                        clickedColumn.getLastCard() &&
                        clickedColumn.getLastCard().hasOwnProperty("color")) {
                        console.log("nie wykonuje");
                        // dopóki zwraca element
                        clickedColumn.getLastCard().setVisible(true).setMoves(true);
                    }
                    console.log("belowClickedCard", belowClickedCard);
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
            console.log("currentCardddd", currentCard);
            if (currentCard.isMoved) {
                console.log("mouseup");
                window.removeEventListener("mousemove", cb);
                // pobieram ostatnie karty z kolumn
                // nie potrzebuje ostatnich dwóch kolumn -  nie chce dodawać tam kart
                let nextColumn;
                g.getColumns(11)
                    .filter((col) => col.checkColumnForElement(currentCard))
                    .forEach((col) => {
                    let card, elem;
                    if (col.direction === "down" && col.cardsInColumn.length > 1) {
                        card = col.getLastCard();
                    }
                    else {
                        elem = col.getFirstCard();
                        card = new Card(elem.element);
                    }
                    if (card.checkIfFits(currentCard, col))
                        nextColumn = col;
                });
                // kolumna w która klikam
                clickedColumn = g.getColumnByIndex(currentCard.columnId);
                clickedCardId = currentCard.idInColumn;
                belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
                //pobieram kolumnę nad którą puszczasz kartę
                let columnWhichGetCards;
                if (nextColumn !== undefined) {
                    columnWhichGetCards = nextColumn;
                    // metoda dodaje i odejmuje karty jeśli mogą zostać przeniesione
                    // jeśli nie karty wracają na swoją starą pozycję
                    columnWhichGetCards.moveIfPossible(belowClickedCard, clickedColumn, clickedCardId);
                    // usuwam klasę(CSS) invisible i dodaję visible do ostatniego elementu DOM w columnie z której prznieniosłem karty
                    if (clickedColumn.getLastCard() &&
                        clickedColumn.getLastCard().hasOwnProperty("color")) {
                        // dopóki zwraca element
                        clickedColumn.getLastCard().setVisible(true).setMoves(true);
                    }
                    // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty
                    // to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
                    if (clickedColumn === g.getColumnByIndex(Column.ForSelectionNext)) {
                        console.log("to nie działa?!?!??!?!?!??????????????????????????????????????????????????");
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
                g.getColumnByIndex(Column.ForSelectionNext).getNextCardFrom(g.getColumnByIndex(Column.ForSelection));
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
        // motoda moveCardsBack() przeniosi karty z kolumny 12 do 11
        g.getColumnByIndex(Column.ForSelection).moveCardsBack(g.getColumnByIndex(Column.ForSelectionNext));
    });
}
foo();
