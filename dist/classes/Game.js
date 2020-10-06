import { Column } from "./Column.js";
import { Card } from "./Card.js";
var ColumnNum;
(function (ColumnNum) {
    ColumnNum[ColumnNum["ForSelection"] = 11] = "ForSelection";
})(ColumnNum || (ColumnNum = {}));
export class Game {
    constructor() {
        this._cards = [];
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
        this._historyOfMovements = new Map();
    }
    // private history = {};
    // zwraca [0,1,2,3,4, ..., 13]
    _getArray() {
        return [...Array(13).keys()];
    }
    // losowa liczba <min, max>
    _randomMinMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // zwraca tablicę 52 obiektów [{color: "", value: (random)},  ....]
    _randomCards() {
        let color = ["pik", "trefl", "karo", "kier"];
        let cards = {
            pik: this._getArray(),
            trefl: this._getArray(),
            karo: this._getArray(),
            kier: this._getArray(),
        };
        return Array(52)
            .fill(null)
            .map((e) => {
            let idColor = this._randomMinMax(0, color.length - 1);
            let cardColor = color[idColor];
            let idValue = this._randomMinMax(0, cards[cardColor].length - 1);
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
    _addCardBoxesElements() {
        const cardBoxes = new DocumentFragment();
        for (let i = 0; i < 7; i++) {
            const box = document.createElement("div");
            box.classList.add("cards-box", "special");
            box.style.top = `${145}px`;
            box.style.left = `${95 + i * 100}px`;
            const boxForCards = {
                element: box,
            };
            this.columns[i].setColumnPosition({ x: 95 + i * 100, y: 145 });
            this.columns[i].addCard([boxForCards]);
            cardBoxes.append(box);
        }
        return cardBoxes;
    }
    // tworzę elementy dla kart od asa w górę
    _addAceUpBoxElements() {
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
            };
            this.columns[index].setColumnPosition({ x: 400 + i * 100, y: 0 });
            this.columns[index].addCard([aAsBox]);
            aceUpBoxes.append(aAs);
        });
        return aceUpBoxes;
    }
    // tworzę i dodaje elementy reprezentujące karty
    _addCards() {
        const cards = new DocumentFragment();
        let column = 7;
        let lastIdInRow = 0;
        let row = 0;
        // rozdanie kart na tą rundę
        // const deal = this._randomCards();
        const deal = [
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 9,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 8,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 4,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 3,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 4,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 5,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 6,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 6,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 5,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 2,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 3,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 4,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 5,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 7,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 1,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 2,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 3,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 4,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 0,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 1,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 2,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 3,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 0,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 1,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 2,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 0,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 1,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 0,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 11,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 9,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 11,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 10,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 10,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 12,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 10,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 7,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 9,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 11,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 8,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 9,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 8,
            },
            {
                color: "kier",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 12,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 10,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 8,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 11,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 12,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 7,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 5,
            },
            {
                color: "pik",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 6,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 7,
            },
            {
                color: "karo",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 12,
            },
            {
                color: "trefl",
                columnId: null,
                element: null,
                idInColumn: null,
                isMoved: null,
                isVisible: null,
                position: { x: 0, y: 0 },
                value: 6,
            },
        ];
        let columnId, idInColumn, isVisible, isMoved, isLast;
        // this.cards =
        deal.map((elem, id) => {
            let cardContainer = document.createElement("div");
            let icon = document.createElement("i");
            let revers = document.createElement("i");
            // let cColor = document.createElement("p"); // to jest do wyszucenia! - chyba
            // let cValue = document.createElement("p"); // to jest do wyszucenia! - chyba
            const { color, value } = elem;
            // cardContainer.style.backgroundImage = `url(.../svg/${color}-${value}.svg)`
            icon.style.backgroundImage = `url(../src/svg/${color}-${value}.svg)`;
            revers.style.backgroundImage = "url(../src/svg/revers.svg)";
            isVisible = false;
            // isVisible = true;
            isMoved = false;
            // isMoved = true;
            // isLast = false;
            // cColor.innerText = color;
            // cValue.innerText = value.toString();
            icon.classList.add("icon", "front");
            revers.classList.add("icon", "back");
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
                card = new Card(cardContainer, color, value, columnId, idInColumn, isVisible, isMoved
                // isLast
                );
                card.setPosition({ x: left + 100, y: top + 150 }).moveTo();
                this.columns[indexColumn].addCard([card]);
                if ((id - lastIdInRow) % column === column - 1 && column > 1) {
                    lastIdInRow = id + 1;
                    column--;
                    row++;
                }
            }
            else {
                cardContainer.classList.add("for-selection");
                columnId = 11;
                idInColumn = 0;
                card = new Card(cardContainer, color, value, columnId, idInColumn, false, false
                // false
                );
                card.setPosition({ x: 0, y: 0 }).moveTo();
                this.columns[ColumnNum.ForSelection].addCard([card]);
                // isVisible = false;
            }
            this._cards.push(card);
            cardContainer.append(revers);
            cardContainer.append(icon);
            cards.append(cardContainer);
        });
        return cards;
    }
    startGame() {
        //losuje karty
        const container = document.querySelector("#container");
        // this.columns[ColumnNum.ForSelection].setColumnPosition({ x: 0, y: 0 });
        const cardBoxes = this._addCardBoxesElements();
        const aceUpBoxes = this._addAceUpBoxElements();
        // ustalam pozycję dla kolumny 11
        this.columns[ColumnNum.ForSelection].setColumnPosition({ x: 0, y: 0 });
        const cards = this._addCards();
        container.append(aceUpBoxes);
        container.append(cardBoxes);
        container.append(cards);
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
        this._historyOfMovements.set(key, value);
        console.log("zapisuje pod kluczem:::", key, value);
    }
    getHistory(key) {
        if (key >= 0) {
            const prevMovement = // {
             this._historyOfMovements.get(key);
            console.log("KEYYYYYYYYYYYYYYYYYYYYYYYY:", prevMovement, key);
            //nadpisuje wartość dla tis._cards
            this._cards = [];
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
                    let newCard = new Card(elem.element, elem.color, elem.value, elem.columnId, elem.idInColumn, elem.isVisible, elem.isMoved
                    // elem.isLast
                    );
                    newCard.setPosition(elem.position).moveTo();
                    this.columns[elem.columnId].addCard([newCard]);
                    this._cards.push(newCard);
                });
            });
        }
        else {
            console.log("Nie możesz cofnać!!");
        }
        console.log("po wepchnieciu kart", this._cards);
        console.log("TO DOSTAJE Z POWROTEM :::: ", this.columns);
    }
    findCard(element) {
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
    autocompleteCards() {
        // biorę tylko kolumny do których rozdaję karty na poczatku (index: 0-6)
        let allPlayingCardsAreVisible = this._cards
            .filter((card) => card.columnId < 7)
            .every((card) => card.isVisible === true);
        const columnsWithPlayingCards = this.columns.slice(0, 7);
        const columnsAceUp = this.columns.filter((col) => col.direction === "up");
        const columnsWithSelectionCards = this.columns.slice(11);
        console.log(columnsWithSelectionCards);
        console.log(columnsWithPlayingCards, columnsAceUp, columnsWithSelectionCards);
        if (allPlayingCardsAreVisible) {
            const container = document.querySelector("#container");
            const btn = document.createElement("button");
            btn.textContent = "Autouzupełnianie";
            container.append(btn);
            btn.addEventListener("click", (e) => {
                let y = 0;
                // dopóki długość 4 kolumn AceUp nie jest rowna 13 to chce coś robić
                while (columnsAceUp[0].cardsInColumn.length !== 13 ||
                    columnsAceUp[1].cardsInColumn.length !== 13 ||
                    columnsAceUp[2].cardsInColumn.length !== 13 ||
                    columnsAceUp[3].cardsInColumn.length !== 13) {
                    // console.log("OK?", y);
                    // console.log(this.columns);
                    for (let i = 0; i < columnsAceUp.length; i++) {
                        let nextColors = columnsAceUp[i].nextCard.colors;
                        let nextValue = columnsAceUp[i].nextCard.value;
                        console.log("nextColor:", nextColors, "nextValue:", nextValue);
                        for (let k = 0; k < columnsWithPlayingCards.length; k++) {
                            if (columnsWithPlayingCards[k].cardsInColumn.length > 1) {
                                const lastCard = columnsWithPlayingCards[k].getLastCard();
                                const lastColor = lastCard === null || lastCard === void 0 ? void 0 : lastCard.color;
                                const lastValue = lastCard === null || lastCard === void 0 ? void 0 : lastCard.value;
                                // jeśli karta pasuje to ...
                                if (nextColors.includes(lastColor) && nextValue === lastValue) {
                                    columnsAceUp[i].moveIfPossible([lastCard], columnsWithPlayingCards[k], lastCard.idInColumn);
                                    // usuń ją
                                    // columnsWithPlayingCards[k].removeCards(lastCard.idInColumn);
                                    // // nadaj jej pozycje
                                    // lastCard
                                    //   .setPosition({
                                    //     x: columnsAceUp[i].getFirstCard().position.x + 5,
                                    //     y: columnsAceUp[i].getFirstCard().position.y + 5,
                                    //   })
                                    //   .moveTo();
                                    // // dodaj ją
                                    // columnsAceUp[i].addCard([lastCard]);
                                    // nadpisz wartość dla 'i' i dla 'k'
                                    i = 0;
                                    k = 0;
                                    // nadpisz nextColor i nextValue
                                    nextColors = columnsAceUp[i].nextCard.colors;
                                    nextValue = columnsAceUp[i].nextCard.value;
                                }
                            }
                        }
                    }
                    console.log(this.columns);
                    // jeśli nic nie ma w kolumnie 0 i 1 (do doboru)
                    // to znaczy że musiałeś ułożyć z kart które miałęś w kolumnach "do gry"
                    if (columnsWithSelectionCards[0].cardsInColumn.length === 0 &&
                        columnsWithSelectionCards[1].cardsInColumn.length === 0) {
                        console.log("break?");
                        break;
                    }
                    const len = columnsWithSelectionCards[0].cardsInColumn.length +
                        columnsWithSelectionCards[1].cardsInColumn.length;
                    let q = 0;
                    while (q < len) {
                        // jeśli kolumna do doboru jest pusta to dodaj do niej kartę
                        if (columnsWithSelectionCards[1].cardsInColumn.length === 0) {
                            // dodaje ostatnią kartą z kolumny z indexem 0 do kolumny z indexem 1
                            columnsWithSelectionCards[1].getNextCardFrom(columnsWithSelectionCards[0]);
                            // const lastCardInSelecion: ICard = columnsWithSelectionCards[0].getLastCard();
                            // // i dodaję ją do kolumny obok
                            // columnsWithSelectionCards[1].addCard([lastCardInSelecion]);
                            // // usuwam z forSelection ostatnią kartę -  to ta kliknięta
                            // columnsWithSelectionCards[0].removeCards(-1);
                            // // ruszam ostatnie 3 karty jakie trafiły do kolumny 12 (Column.ForSelectionNext)
                            // columnsWithSelectionCards[1].moveCards();
                        }
                        let lastCard = columnsWithSelectionCards[1].getLastCard();
                        let lastColor = lastCard.color;
                        let lastValue = lastCard.value;
                        let hasFound = false;
                        for (let j = 0; j < columnsAceUp.length; j++) {
                            let nextColors = columnsAceUp[j].nextCard.colors;
                            let nextValue = columnsAceUp[j].nextCard.value;
                            // jeśli karta z 'do doboru' pasuje to ...
                            if (nextColors.includes(lastColor) && nextValue === lastValue) {
                                columnsAceUp[j].moveIfPossible([lastCard], columnsWithSelectionCards[1], lastCard.idInColumn);
                                // usuń ją
                                // columnsWithSelectionCards[1].removeCards(lastCard.idInColumn);
                                // // nadaj jej pozycje
                                // lastCard
                                //   .setPosition({
                                //     x: columnsAceUp[j].getFirstCard().position.x + 5,
                                //     y: columnsAceUp[j].getFirstCard().position.y + 5,
                                //   })
                                //   .moveTo();
                                // // dodaj ją
                                // columnsAceUp[j].addCard([lastCard]);
                                // porusz resztę kart w "do doboru"
                                columnsWithSelectionCards[1].moveCards();
                                // znalazłem więc kończę pętle while
                                hasFound = true;
                                // przerwij pętle
                                break;
                            }
                        }
                        if (hasFound) {
                            console.log("breaaaaaak");
                            break;
                        }
                        // jesli nie znalazł
                        // to bierze następną kartę jeśli może
                        if (columnsWithSelectionCards[0].cardsInColumn.length > 0) {
                            // dodaje ostatnią kartą z kolumny z indexem 0 do kolumny z indexem 1
                            columnsWithSelectionCards[1].getNextCardFrom(columnsWithSelectionCards[0]);
                            // const lastCardInSelecion: ICard = columnsWithSelectionCards[0].getLastCard();
                            // // i dodaję ją do kolumny obok
                            // columnsWithSelectionCards[1].addCard([lastCardInSelecion]);
                            // // usuwam z forSelection ostatnią kartę -  to ta kliknięta
                            // columnsWithSelectionCards[0].removeCards(-1);
                            // // ruszam ostatnie 3 karty jakie trafiły do kolumny 12 (Column.ForSelectionNext)
                            // columnsWithSelectionCards[1].moveCards();
                        }
                        else {
                            // jeśli nie może wziąć następnej karty to przekłada z kolumnny 1 do 0
                            columnsWithSelectionCards[0].moveCardsBack(columnsWithSelectionCards[1]);
                            // const cards = columnsWithSelectionCards[1]
                            //   .getCardsBelow(0)
                            //   .reverse();
                            // cards.forEach((c) => {
                            //   c.setPosition({ x: 0, y: 0 }).moveTo();
                            //   c.setIsVisible(false);
                            //   c.setIsMoved(false);
                            // });
                            // columnsWithSelectionCards[1].removeCards(0);
                            // columnsWithSelectionCards[0].addCard(cards);
                        }
                        q++;
                    }
                    if (y < 100) {
                        y++;
                        // console.log(this.columns);
                    }
                    else {
                        break;
                    }
                }
            });
        }
        console.log(allPlayingCardsAreVisible);
    }
}
// const deal = [
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 8,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 7,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 3,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 4,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 5,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 6,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 6,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 5,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 2,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 3,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 4,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 5,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 4,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 1,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 2,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 3,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 4,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 0,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 1,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 2,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 3,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 0,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 1,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 2,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 0,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 1,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 0,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 11,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 9,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 11,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 10,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 10,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 12,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 10,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 7,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 9,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 11,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 8,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 9,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 9,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 8,
//   },
//   {
//     color: "kier",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 12,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 10,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 8,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 11,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 12,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 7,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 5,
//   },
//   {
//     color: "pik",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 6,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 7,
//   },
//   {
//     color: "karo",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 12,
//   },
//   {
//     color: "trefl",
//     columnId: null,
//     element: null,
//     idInColumn: null,
//     isMoved: null,
//     isVisible: null,
//     position: { x: 0, y: 0 },
//     value: 6,
//   },
// ];
