import { Game } from "./classes/Game.js";
import { Card } from "./classes/Card.js";
import { ICard, IPosition } from "./interfaces/ICard.js";
import { IColumn } from "./interfaces/IColumn.js";
import { Movements } from "./classes/Movements.js";
import { Timer } from "./classes/Timer.js";

enum Column {
  ForSelection = 11,
  ForSelectionNext = 12,
}

interface IObjectCard {
  color: string;
  value: number;
}

const container = document.querySelector("#container") as HTMLDivElement;
const movementsContainer = document.querySelector(
  "#movements"
) as HTMLDivElement;
const timerContainer = document.querySelector("#timer") as HTMLDivElement;
const newGameBtn = document.querySelector("#new-game") as HTMLButtonElement;
const undoBtn = document.querySelector("#undo") as HTMLButtonElement;

let game = new Game(container);
const movements = new Movements(movementsContainer);
const timer = new Timer(timerContainer);

game.startGame();
timer.startTimer();

function gameSettings() {
  //zapisuje początkowy stan gry
  game.setHistory(movements.getMovements());

  const cards = Array.from(
    document.querySelectorAll(".card")
  ) as HTMLDivElement[];
  const forSelection = Array.from(
    document.querySelectorAll(".for-selection")
  ) as HTMLDivElement[];
  const repeat = document.querySelector(".repeat") as HTMLDivElement;

  cards.forEach((element) => {
    let currentCard: ICard | undefined;

    // callback function dla window "mousemove"
    let callbackMoveFn: (e: MouseEvent) => void;

    // kolumna z której przenosze karty
    let clickedColumn: IColumn;
    // id karty którą przenoszę - potrzebne do ustawienia class visible dla elementu wyżej
    let clickedCardId: number;

    // ************************************************************************************************************************************************************************************
    element.addEventListener("mousedown", (e: MouseEvent) => {
      currentCard = game.findCard(element);
      if (currentCard !== undefined && currentCard.isMoved) {
        // pozycja kursora w momencie mousedown
        let clickedPosition: IPosition = {
          x: element.offsetLeft - e.clientX,
          y: element.offsetTop - e.clientY,
        };
        // kolumna w która klikam
        clickedColumn = game.getColumnByIndex(currentCard.columnId);
        clickedCardId = currentCard.idInColumn;
        // karty które przenoszę - Card[]
        let belowClickedCard = clickedColumn.getCardsBelow(
          clickedCardId
        ) as ICard[];
        // ustawienie pozycji przed "mousemove" - żebym wiedział gdzie wrócić
        belowClickedCard.forEach((card) => {
          card.setPosition({
            x: card.element.offsetLeft,
            y: card.element.offsetTop,
          });
        });

        // calback fn in window "move" event
        callbackMoveFn = (e: MouseEvent) =>
          belowClickedCard.forEach((card, id) =>
            card.move(e, clickedPosition, id)
          );
        window.addEventListener("mousemove", callbackMoveFn);
      }
    });
    // ************************************************************************************************************************************************************************************
    element.addEventListener("mouseup", (e: Event) => {
      if (currentCard !== undefined && currentCard.isMoved) {
        // usuwam możliwość przenoszenia karty w momencie "mouseup"
        window.removeEventListener("mousemove", callbackMoveFn);

        let nextColumn: IColumn | undefined;
        game
          .getColumns(11)
          .filter((col) => col.checkColumnForElement(currentCard!))
          .forEach((col) => {
            let card, elem;
            if (col.direction === "down" && col.cardsInColumn.length > 1) {
              card = col.getLastCard() as ICard;
            } else {
              elem = col.getFirstCard();
              // tworzę new Card z pierwszego elementu tylko po to by dalej wywołać metodę checkIfFits
              card = new Card(elem.element);
            }

            if (card!.checkIfFits(currentCard!, col)) nextColumn = col;
          });

        // kolumna w która klikam
        clickedColumn = game.getColumnByIndex(currentCard.columnId);
        clickedCardId = currentCard.idInColumn;
        // karty które przenoszę - Card[]
        let belowClickedCard = clickedColumn.getCardsBelow(
          clickedCardId
        ) as ICard[];

        if (nextColumn) {
          // metoda dodaje i odejmuje karty + przenosze je
          nextColumn.moveIfPossible(
            belowClickedCard,
            clickedColumn,
            clickedCardId
          );

          const clickedColLastCard = clickedColumn.getLastCard();
          // dopóki lastCard zwraca Card to zmieniaj mu ustawienia
          if (clickedColLastCard instanceof Card) {
            clickedColLastCard.setVisible(true).setMoves(true);
          }

          // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty "do doboru" - kolumna 12
          // to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
          if (
            clickedColumn === game.getColumnByIndex(Column.ForSelectionNext)
          ) {
            clickedColumn.moveCards();
          }

          // dodaje +1 do movements
          movements.incrementState();
          // zapisuje ten ruch do historii
          const key: number = movements.getMovements();
          game.setHistory(key);
          // sprawdzam czy skończyłeś już grę
          game.gameResult();
          // możliwość autouzupełnienia kart
          game.autocompleteCards();
        } else {
          // cofnij do starej pozycji
          belowClickedCard.forEach((c) => c.moveTo());
        }
      }
    });
    // ************************************************************************************************************************************************************************************
    element.addEventListener("dblclick", (e: Event) => {
      currentCard = game.findCard(element);
      if (currentCard !== undefined && currentCard.isMoved) {
        // pobieram wszystkie kolumny które przyjmują karty
        // odwracam tabicę bo zależy mi żeby karty w pierwszej kolejności trafiały do górnych boxów
        let columns = game.getColumns(11).reverse();

        // kolumna w która klikam
        clickedColumn = game.getColumnByIndex(currentCard.columnId);
        clickedCardId = currentCard.idInColumn;
        // karty które przenoszę - Card[]
        let belowClickedCard = clickedColumn.getCardsBelow(
          clickedCardId
        ) as ICard[];

        // sprawdzam do której kolumny pasuje karta
        const nextColumn = columns.find((col) =>
          col.checkColumnForElement(currentCard!)
        );

        if (nextColumn) {
          // dodaję, usuwam i przenoszę karty/karte
          nextColumn.moveIfPossible(
            belowClickedCard,
            clickedColumn,
            clickedCardId
          );

          // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty w kolumnie "do doboru"
          // to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
          if (
            clickedColumn === game.getColumnByIndex(Column.ForSelectionNext)
          ) {
            clickedColumn.moveCards();
          }

          const clickedColLastCard = clickedColumn.getLastCard();
          if (currentCard.columnId < 11 && clickedColLastCard instanceof Card) {
            clickedColLastCard.setVisible(true).setMoves(true);
          }

          // dodaje +1 do movements
          movements.incrementState();
          // zapisuje ten ruch w historii
          const key: number = movements.getMovements();
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
    element.addEventListener("click", (e: Event) => {
      const currentCard = game.findCard(element)!;
      // jeśli niewidoczny to ...
      if (!currentCard.isVisible) {
        game
          .getColumnByIndex(Column.ForSelectionNext)
          .getNextCardFrom(game.getColumnByIndex(Column.ForSelection));

        // dodaje +1 do movements
        movements.incrementState();
        // zapisuje ruch w historii
        const key: number = movements.getMovements();
        game.setHistory(key);
      }
    });
  });

  // cofanie kart z powrotem do kolumny forSelection
  repeat.addEventListener("click", (e: Event) => {
    // motoda moveCardsBack() przeniosi karty z kolumny 12 do 11
    game
      .getColumnByIndex(Column.ForSelection)
      .moveCardsBack(game.getColumnByIndex(Column.ForSelectionNext));
  });
}

gameSettings();

newGameBtn.addEventListener("click", (e: Event) => {
  // czyszczenie div#container
  container.innerHTML = "";
  game = new Game(container);
  game.startGame();
  timer.resetTimer();
  movements.resetState();
  gameSettings();
});

undoBtn.addEventListener("click", (e: Event) => {
  let currentMovement: number = movements.getMovements();
  let key: number = currentMovement - 1;
  game.getHistory(key);
  movements.decrementState();
});

// ************************************************************************************************************************************************************************************
window.addEventListener("contextmenu", (e: Event) => e.preventDefault());
