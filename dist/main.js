import { Game } from "./classes/Game.js";
import { Card } from "./classes/Card.js";
import { Movements } from "./classes/Movements.js";
import { Timer } from "./classes/Timer.js";
var Column;
(function (Column) {
    Column[Column["ForSelection"] = 11] = "ForSelection";
    Column[Column["ForSelectionNext"] = 12] = "ForSelectionNext";
})(Column || (Column = {}));
const container = document.querySelector("#container");
const movementsContainer = document.querySelector("#movements");
const timerContainer = document.querySelector("#timer");
const newGameBtn = document.querySelector("#new-game");
const undoBtn = document.querySelector("#undo");
let game = new Game(container);
const movements = new Movements(movementsContainer);
const timer = new Timer(timerContainer);
game.startGame();
timer.startTimer();
function gameSettings() {
    //zapisuje początkowy stan gry
    game.setHistory(movements.getMovements());
    const cards = Array.from(document.querySelectorAll(".card"));
    const forSelection = Array.from(document.querySelectorAll(".for-selection"));
    const repeat = document.querySelector(".repeat");
    cards.forEach((element) => {
        let currentCard;
        // callback function dla window "mousemove"
        let callbackMoveFn;
        // kolumna z której przenosze karty
        let clickedColumn;
        // id karty którą przenoszę - potrzebne do ustawienia class visible dla elementu wyżej
        let clickedCardId;
        // ************************************************************************************************************************************************************************************
        element.addEventListener("mousedown", (e) => {
            currentCard = game.findCard(element);
            if (currentCard !== undefined && currentCard.isMoved) {
                // pozycja kursora w momencie mousedown
                let clickedPosition = {
                    x: element.offsetLeft - e.clientX,
                    y: element.offsetTop - e.clientY,
                };
                // kolumna w która klikam
                clickedColumn = game.getColumnByIndex(currentCard.columnId);
                clickedCardId = currentCard.idInColumn;
                // karty które przenoszę - Card[]
                let belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
                // ustawienie pozycji przed "mousemove" - żebym wiedział gdzie wrócić
                belowClickedCard.forEach((card) => {
                    card.setPosition({
                        x: card.element.offsetLeft,
                        y: card.element.offsetTop,
                    });
                });
                // calback fn in window "move" event
                callbackMoveFn = (e) => belowClickedCard.forEach((card, id) => card.move(e, clickedPosition, id));
                window.addEventListener("mousemove", callbackMoveFn);
            }
        });
        // ************************************************************************************************************************************************************************************
        element.addEventListener("mouseup", (e) => {
            if (currentCard !== undefined && currentCard.isMoved) {
                // usuwam możliwość przenoszenia karty w momencie "mouseup"
                window.removeEventListener("mousemove", callbackMoveFn);
                let nextColumn;
                game
                    .getColumns(11)
                    .filter((col) => col.checkColumnForElement(currentCard))
                    .forEach((col) => {
                    let card, elem;
                    if (col.direction === "down" && col.cardsInColumn.length > 1) {
                        card = col.getLastCard();
                    }
                    else {
                        elem = col.getFirstCard();
                        // tworzę new Card z pierwszego elementu tylko po to by dalej wywołać metodę checkIfFits
                        card = new Card(elem.element);
                    }
                    if (card.checkIfFits(currentCard, col))
                        nextColumn = col;
                });
                // kolumna w która klikam
                clickedColumn = game.getColumnByIndex(currentCard.columnId);
                clickedCardId = currentCard.idInColumn;
                // karty które przenoszę - Card[]
                let belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
                if (nextColumn) {
                    // metoda dodaje i odejmuje karty + przenosze je
                    nextColumn.moveIfPossible(belowClickedCard, clickedColumn, clickedCardId);
                    const clickedColLastCard = clickedColumn.getLastCard();
                    // dopóki lastCard zwraca Card to zmieniaj mu ustawienia
                    if (clickedColLastCard instanceof Card) {
                        clickedColLastCard.setVisible(true).setMoves(true);
                    }
                    // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty "do doboru" - kolumna 12
                    // to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
                    if (clickedColumn === game.getColumnByIndex(Column.ForSelectionNext)) {
                        clickedColumn.moveCards();
                    }
                    // dodaje +1 do movements
                    movements.incrementState();
                    // zapisuje ten ruch do historii
                    const key = movements.getMovements();
                    game.setHistory(key);
                    // sprawdzam czy skończyłeś już grę
                    game.gameResult();
                    // możliwość autouzupełnienia kart
                    game.autocompleteCards();
                }
                else {
                    // cofnij do starej pozycji
                    belowClickedCard.forEach((c) => c.moveTo());
                }
            }
        });
        // ************************************************************************************************************************************************************************************
        element.addEventListener("dblclick", (e) => {
            currentCard = game.findCard(element);
            if (currentCard !== undefined && currentCard.isMoved) {
                // pobieram wszystkie kolumny które przyjmują karty
                // odwracam tabicę bo zależy mi żeby karty w pierwszej kolejności trafiały do górnych boxów
                let columns = game.getColumns(11).reverse();
                // kolumna w która klikam
                clickedColumn = game.getColumnByIndex(currentCard.columnId);
                clickedCardId = currentCard.idInColumn;
                // karty które przenoszę - Card[]
                let belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
                // sprawdzam do której kolumny pasuje karta
                const nextColumn = columns.find((col) => col.checkColumnForElement(currentCard));
                if (nextColumn) {
                    // dodaję, usuwam i przenoszę karty/karte
                    nextColumn.moveIfPossible(belowClickedCard, clickedColumn, clickedCardId);
                    // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty w kolumnie "do doboru"
                    // to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
                    if (clickedColumn === game.getColumnByIndex(Column.ForSelectionNext)) {
                        clickedColumn.moveCards();
                    }
                    const clickedColLastCard = clickedColumn.getLastCard();
                    if (currentCard.columnId < 11 && clickedColLastCard instanceof Card) {
                        clickedColLastCard.setVisible(true).setMoves(true);
                    }
                    // dodaje +1 do movements
                    movements.incrementState();
                    // zapisuje ten ruch w historii
                    const key = movements.getMovements();
                    game.setHistory(key);
                    // sprawdzam czy skończyłeś już grę
                    game.gameResult();
                    // mozliwość autouzupełnienia kodu
                    game.autocompleteCards();
                }
            }
        });
    });
    // ************************************************************************************************************************************************************************************
    forSelection.forEach((element) => {
        element.addEventListener("click", (e) => {
            const currentCard = game.findCard(element);
            // jeśli niewidoczny to ...
            if (!currentCard.isVisible) {
                game
                    .getColumnByIndex(Column.ForSelectionNext)
                    .getNextCardFrom(game.getColumnByIndex(Column.ForSelection));
                // dodaje +1 do movements
                movements.incrementState();
                // zapisuje ruch w historii
                const key = movements.getMovements();
                game.setHistory(key);
            }
        });
    });
    // cofanie kart z powrotem do kolumny forSelection
    repeat.addEventListener("click", (e) => {
        // motoda moveCardsBack() przeniosi karty z kolumny 12 do 11
        game
            .getColumnByIndex(Column.ForSelection)
            .moveCardsBack(game.getColumnByIndex(Column.ForSelectionNext));
    });
}
gameSettings();
newGameBtn.addEventListener("click", (e) => {
    // czyszczenie div#container
    container.innerHTML = "";
    game = new Game(container);
    game.startGame();
    timer.resetTimer();
    movements.resetState();
    gameSettings();
});
undoBtn.addEventListener("click", (e) => {
    let currentMovement = movements.getMovements();
    let key = currentMovement - 1;
    game.getHistory(key);
    movements.decrementState();
});
// ************************************************************************************************************************************************************************************
window.addEventListener("contextmenu", (e) => e.preventDefault());
