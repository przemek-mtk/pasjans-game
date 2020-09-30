import { Column } from "./Column.js";
import { Card } from "./Card.js";
var ColumnNum;
(function (ColumnNum) {
    ColumnNum[ColumnNum["ForSelection"] = 11] = "ForSelection";
})(ColumnNum || (ColumnNum = {}));
export class Game {
    constructor() {
        this.cards = [];
        this.columns = Array(13)
            .fill(null)
            .map((e, i) => {
            if (i > 6 && i < 11)
                return new Column(i, "up"); // kolumny dla kart od asa w górę
            return new Column(i, "down"); //reszta
        });
        // columny z indexami 11 i 12 jest dla elementów mających klasę(CSS) "for-selection" - są to karty do dobrania w górynym lewym rogu
        // columny z indexem  7-10 są dla kart od asa w górę
        // property dla cofania
        this.historyOfMovements = new Map();
    }
    // private history = {};
    // zwraca [0,1,2,3,4, ..., 13]
    getArray() {
        return [...Array(13).keys()];
    }
    // losowa liczba <min, max>
    randomMinMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // zwraca tablicę 52 obiektów [{color: "", value: (random)},  ....]
    randomCards() {
        let color = ["pik", "trefl", "karo", "kier"];
        let cards = {
            pik: this.getArray(),
            trefl: this.getArray(),
            karo: this.getArray(),
            kier: this.getArray(),
        };
        return Array(52)
            .fill(null)
            .map((e) => {
            let idColor = this.randomMinMax(0, color.length - 1);
            let cardColor = color[idColor];
            let idValue = this.randomMinMax(0, cards[cardColor].length - 1);
            let valueCard = cards[cardColor].splice(idValue, 1);
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
    addCardBoxesElements() {
        const cardBoxes = new DocumentFragment();
        for (let i = 0; i < 7; i++) {
            const box = document.createElement("div");
            box.classList.add("cards-box", "special");
            box.style.top = `${145}px`;
            box.style.left = `${95 + i * 100}px`;
            const boxForCards = {
                element: box,
            };
            this.columns[i].addCard([boxForCards]);
            cardBoxes.append(box);
        }
        return cardBoxes;
    }
    // tworzę elementy dla kart od asa w górę
    addAceUpBoxElements() {
        const aceUpBoxes = new DocumentFragment();
        this.columns
            .filter((col) => col.direction === "up")
            .forEach((col, i) => {
            const index = col.columnNum;
            const aAs = document.createElement("div");
            aAs.classList.add("above-as", "special");
            aAs.style.top = `${0}px`;
            aAs.style.right = `${i * 100}px`;
            const aAsBox = {
                element: aAs,
            };
            this.columns[index].addCard([aAsBox]);
            aceUpBoxes.append(aAs);
        });
        return aceUpBoxes;
    }
    // tworzę i dodaje elementy reprezentujące karty
    addCards() {
        const cards = new DocumentFragment();
        let column = 7;
        let lastIdInRow = 0;
        let row = 0;
        // rozdanie kart na tą rundę
        const deal = this.randomCards();
        let columnId, idInColumn, isVisible, isMoved, isLast;
        // this.cards =
        deal.map((elem, id) => {
            let cardContainer = document.createElement("div");
            let cColor = document.createElement("p"); // to jest do wyszucenia! - chyba
            let cValue = document.createElement("p"); // to jest do wyszucenia! - chyba
            const { color, value } = elem;
            isVisible = false;
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
                    cardContainer.classList.add("visible", "moved");
                    cardContainer.classList.remove("invisible");
                    isVisible = true;
                    isMoved = true;
                    isLast = true;
                }
                card = new Card(cardContainer, color, value, columnId, idInColumn, isVisible, isMoved);
                card.setPosition({ x: left + 100, y: top + 150 });
                this.columns[indexColumn].addCard([card]);
                if ((id - lastIdInRow) % column === column - 1 && column > 1) {
                    lastIdInRow = id + 1;
                    column--;
                    row++;
                }
            }
            else {
                cardContainer.classList.add("for-selection");
                columnId = 12;
                idInColumn = 0;
                card = new Card(cardContainer, color, value, columnId, idInColumn, false, false);
                card.setPosition({ x: 0, y: 0 });
                this.columns[ColumnNum.ForSelection].addCard([card]);
                // isVisible = false;
            }
            this.cards.push(card);
            cardContainer.append(cColor);
            cardContainer.append(cValue);
            cards.append(cardContainer);
        });
        return cards;
    }
    startGame() {
        //losuje karty
        const container = document.querySelector("#container");
        const cardBoxes = this.addCardBoxesElements();
        const aceUpBoxes = this.addAceUpBoxElements();
        const cards = this.addCards();
        container.append(aceUpBoxes);
        container.append(cardBoxes);
        container.append(cards);
    }
    // TEST TEST TEST TEST TEST TEST TEST TEST
    getCards() {
        return this.cards;
    }
    // zwraca klikniętą kolumnę
    getColumn(data) {
        return this.columns.find((col) => col.getCardId(data) > -1);
    }
    // zwraca tablicę w formie tablicy kolumn, lecz zamiast Card są zwykłe obiekty
    setObjectInColums(columns) {
        return columns.map((col) => {
            return col.cardsInColumn
                .filter((card) => card.hasOwnProperty("color"))
                .map((x) => (Object.assign({}, x)));
        });
    }
    setHistory(key) {
        const value = this.setObjectInColums(this.columns);
        this.historyOfMovements.set(key, value);
        console.log("zapisuje pod kluczem:::", key, value);
    }
    getHistory(key) {
        if (key >= 0) {
            const prevMovement = this.historyOfMovements.get(key);
            console.log("KEYYYYYYYYYYYYYYYYYYYYYYYY:", prevMovement, key);
            // czyszcze kolumny
            this.columns.forEach((col, id) => {
                // wszystkie kolumny które mają dodatkowy element
                if (id < 11) {
                    col.removeCards(1);
                }
                else {
                    col.removeCards(0);
                }
            });
            // dodaje do kolumn odpowiednie karty
            prevMovement.forEach((col) => {
                col.forEach((elem) => {
                    let newCard = new Card(elem.element, elem.color, elem.value, elem.columnId, elem.idInColumn, elem.isVisible, elem.isMoved);
                    newCard.setPosition(elem.position);
                    newCard.moveTo();
                    this.columns[elem.columnId].addCard([newCard]);
                });
            });
        }
        else {
            console.log("Nie możesz cofnać!!");
        }
        console.log("TO DOSTAJE Z POWROTEM :::: ", this.columns);
    }
}
