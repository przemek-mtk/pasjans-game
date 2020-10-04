import { IGame } from "../interfaces/IGame";
import { ICards } from "../interfaces/ICards";
import { Column } from "./Column.js";
import { IColumn } from "../interfaces/IColumn";
import { Card } from "./Card.js";
import { ICard } from "../interfaces/ICard";

enum ColumnNum {
  ForSelection = 11,
}

export class Game implements IGame {
  private _cards: ICard[] = [];
  public columns = Array(13)
    .fill(null)
    .map((e, i) => {
      if (i > 6 && i < 11) return new Column(i, "up"); // kolumny dla kart od asa w górę
      return new Column(i, "down"); //reszta
    });
  // columny z indexami 11 i 12 jest dla elementów mających klasę(CSS) "for-selection" - są to karty do dobrania w górynym lewym rogu
  // columny z indexem  7-10 są dla kart od asa w górę

  // property dla cofania
  private _historyOfMovements = new Map();
  // private history = {};

  // zwraca [0,1,2,3,4, ..., 13]
  private _getArray(): number[] {
    return [...Array(13).keys()];
  }
  // losowa liczba <min, max>
  private _randomMinMax(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // zwraca tablicę 52 obiektów [{color: "", value: (random)},  ....]
  private _randomCards(): ICards[] {
    let color: string[] = ["pik", "trefl", "karo", "kier"];
    let cards: {
      [key: string]: number[];
      pik: number[];
      trefl: number[];
      karo: number[];
      kier: number[];
    } = {
      pik: this._getArray(),
      trefl: this._getArray(),
      karo: this._getArray(),
      kier: this._getArray(),
    };

    return Array(52)
      .fill(null)
      .map((e) => {
        let idColor: number = this._randomMinMax(0, color.length - 1);
        let cardColor: string = color[idColor];
        let idValue: number = this._randomMinMax(
          0,
          cards[cardColor].length - 1
        );
        let valueCard: number[] = cards[cardColor].splice(idValue, 1);

        if (cards[cardColor].length === 0) {
          color.splice(idColor, 1);
        }

        return {
          element: null,
          color: cardColor,
          value: valueCard[0],
          columnId: null,
          idInColumn: null,
          isVisible: null,
          isMoved: null,
          // isLast: null,
          position: { x: 0, y: 0 },
        };
      });
  }
  // dodaje elementy do przetrzymywania kart
  private _addCardBoxesElements() {
    const cardBoxes = new DocumentFragment();

    for (let i = 0; i < 7; i++) {
      const box = document.createElement("div");
      box.classList.add("cards-box", "special");

      box.style.top = `${145}px`;
      box.style.left = `${95 + i * 100}px`;

      const boxForCards = {
        element: box,
        position: {
          x: 95 + i * 100,
          y: 145,
        },
        isSpecial: true,
        // direction: "down"
        // color: "all",
        // value: 13
      };

      this.columns[i].addCard([boxForCards]);
      cardBoxes.append(box);
    }

    return cardBoxes;
  }
  // tworzę elementy dla kart od asa w górę
  private _addAceUpBoxElements() {
    const aceUpBoxes = new DocumentFragment();

    this.columns
      .filter((col) => col.direction === "up")
      .forEach((col, i) => {
        const index = col.columnNum;
        const aAs = document.createElement("div");

        aAs.classList.add("above-as", "special");

        aAs.style.top = `${0}px`;
        aAs.style.left = `${400 + i * 100}px`;

        const aAsBox = {
          element: aAs,
          position: {
            x: 400 + i * 100,
            y: 0,
          },
          isSpecial: true,
          // direction: "up"
        };

        this.columns[index].addCard([aAsBox]);
        aceUpBoxes.append(aAs);
      });

    return aceUpBoxes;
  }
  // tworzę i dodaje elementy reprezentujące karty
  private _addCards() {
    const cards = new DocumentFragment();
    let column = 7;
    let lastIdInRow = 0;
    let row = 0;

    // rozdanie kart na tą rundę
    const deal = this._randomCards();
    let columnId, idInColumn, isVisible, isMoved, isLast;

    // this.cards =
    deal.map((elem, id) => {
      let cardContainer = document.createElement("div");
      let cColor = document.createElement("p"); // to jest do wyszucenia! - chyba
      let cValue = document.createElement("p"); // to jest do wyszucenia! - chyba
      const { color, value } = elem;

      isVisible = false;
      // isVisible = true;
      isMoved = false;
      // isLast = false;

      cColor.innerText = color;
      cValue.innerText = value.toString();

      cardContainer.classList.add("card", "invisible");
      cardContainer.setAttribute("id", `card-${id}`);
      // cardContainer.dataset.color = color;
      // cardContainer.dataset.value = value.toString();

      let card;
      //te są dodawane do 'gry' reszta do 'doboru'
      if (id < 28) {
        const top = row * 100; // do zmiany
        const left = (id - lastIdInRow + row) * 100;
        const indexColumn = id - lastIdInRow + row;

        // card.style.top = `${150 + idInColumn * top}px`;
        // card.style.left = `${100 + left}px`;

        columnId = id - lastIdInRow + row;
        idInColumn = row;
        //zmiana visible dla konkretnych kart, które są ostatnimi w swojej columnie
        if (id === lastIdInRow) {
          cardContainer.classList.add("visible");
          cardContainer.classList.remove("invisible");
          isVisible = true;
          isMoved = true;
          isLast = true;
        }

        card = new Card(
          cardContainer,
          color,
          value,
          columnId,
          idInColumn,
          isVisible,
          isMoved
          // isLast
        );
        card.setPosition({ x: left + 100, y: top + 150 }).moveTo();
        this.columns[indexColumn].addCard([card]);

        if ((id - lastIdInRow) % column === column - 1 && column > 1) {
          lastIdInRow = id + 1;
          column--;
          row++;
        }
      } else {
        cardContainer.classList.add("for-selection");
        columnId = 11;
        idInColumn = 0;
        card = new Card(
          cardContainer,
          color,
          value,
          columnId,
          idInColumn,
          false,
          false
          // false
        );
        card.setPosition({ x: 0, y: 0 }).moveTo();
        this.columns[ColumnNum.ForSelection].addCard([card]);
        // isVisible = false;
      }

      this._cards.push(card);

      cardContainer.append(cColor);
      cardContainer.append(cValue);
      cards.append(cardContainer);
    });

    return cards;
  }

  startGame() {
    //losuje karty

    const container = document.querySelector("#container")!;

    const cardBoxes = this._addCardBoxesElements();
    const aceUpBoxes = this._addAceUpBoxElements();
    const cards = this._addCards();

    container.append(aceUpBoxes);
    container.append(cardBoxes);
    container.append(cards);
  }

  // zwraca klikniętą kolumnę
  getColumn(data: ICards) {
    return this.columns.find((col) => col.getCardId(data) > -1);
  }

  // zwraca tablicę w formie tablicy kolumn, lecz zamiast Card są zwykłe obiekty
  setObjectInColums(columns: IColumn[]) {
    return columns.map((col) => {
      return col.cardsInColumn
        .filter((card) => card.hasOwnProperty("color"))
        .map((x) => ({ ...x }));
    });
  }

  setHistory(key: number) {
    const value = this.setObjectInColums(this.columns);
    this._historyOfMovements.set(key, value);

    console.log("zapisuje pod kluczem:::", key, value);
  }

  getHistory(key: number) {
    if (key >= 0) {
      const prevMovement: // {
      //   element: HTMLDivElement;
      //   color: string;
      //   value: number;
      //   columnId: number;
      //   idInColumn: number;
      //   isVisible: boolean;
      //   isMoved: boolean;
      //   isLast: boolean;
      //   position: { x: number; y: number };
      // }
      ICards[][] = this._historyOfMovements.get(key);

      console.log("KEYYYYYYYYYYYYYYYYYYYYYYYY:", prevMovement, key);
      //nadpisuje wartość dla tis._cards
      this._cards = [];

      // czyszcze kolumny
      this.columns.forEach((col, id) => {
        // wszystkie kolumny które mają dodatkowy element
        if (id < 11) {
          col.removeCards(1);
        } else {
          col.removeCards(0);
        }
      });

      // dodaje do kolumn odpowiednie karty
      prevMovement.forEach((col) => {
        col.forEach((elem) => {
          let newCard: ICard = new Card(
            elem.element,
            elem.color,
            elem.value,
            elem.columnId,
            elem.idInColumn,
            elem.isVisible,
            elem.isMoved
            // elem.isLast
          );

          newCard.setPosition(elem.position).moveTo();
          this.columns[elem.columnId].addCard([newCard]);
          this._cards.push(newCard);
        });
      });
    } else {
      console.log("Nie możesz cofnać!!");
    }

    console.log("po wepchnieciu kart", this._cards);
    console.log("TO DOSTAJE Z POWROTEM :::: ", this.columns);
  }

  findCard(element: HTMLDivElement) {
    return this._cards.find((c) => c.element === element);
  }

  gameResult() {
    let result = this.columns
      .filter((col) => col.direction === "up")
      .every((col) => col.cardsInColumn.length === 13);

    console.log("WYGRAŁEŚ??? --> ", result);

    if (result) {
      alert("WYGRAŁEŚ BYCZKU! xD");
    }
  }

  // **************************************************************************
  // **************************************************************************
  // **************************************************************************
  // **************************************************************************
  autocompleteCards() {
    // biorę tylko kolumny do których rozdaję karty na poczatku (index: 0-6)
    let allPlayingCardsAreVisible = this._cards
      .filter((card) => card.columnId < 7)
      .every((card) => card.isVisible === true);

    const columnsWithPlayingCards = this.columns.slice(0, 7);
    const columnsAceUp = this.columns.filter((col) => col.direction === "up");
    const columnsWithSelectionCards = this.columns.slice(11);
    console.log(columnsWithSelectionCards);

    console.log(
      columnsWithPlayingCards,
      columnsAceUp,
      columnsWithSelectionCards
    );

    console.log(allPlayingCardsAreVisible);
  }
}
