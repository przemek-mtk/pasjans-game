var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Column } from "./Column.js";
import { Card } from "./Card.js";
var ColumnNum;
(function (ColumnNum) {
    ColumnNum[ColumnNum["ForSelection"] = 11] = "ForSelection";
})(ColumnNum || (ColumnNum = {}));
export class Game {
    constructor(container) {
        this.container = container;
        this._cards = [];
        this.columns = [];
        this._historyOfMovements = new Map();
        this._createColumns();
    }
    // tworzy kolumny dla kart
    _createColumns() {
        for (let i = 0; i < 13; i++) {
            let newColumn;
            if (i < 7) {
                // pierwsze 7 jest do gry rozlosowanymi kartami
                newColumn = new Column(i, "down");
            }
            else if (i > 6 && i < 11) {
                // kolejne 4 do układania od asa w górę
                newColumn = new Column(i, "up");
            }
            else {
                // ostatnie 2 dla kart "do doboru"
                newColumn = new Column(i, null);
            }
            this.columns.push(newColumn);
        }
    }
    // losowa liczba <min, max>
    _randomMinMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // zwraca tablicę 52 obiektów [{color: "", value: (random)},  ....]
    _shuffleCards() {
        const values = [...Array(13).keys()];
        const colors = ["pik", "trefl", "karo", "kier"];
        let cards = [];
        let deck = [];
        for (let value of values) {
            for (let color of colors) {
                cards.push({ value, color });
            }
        }
        while (cards.length - 1 >= 0) {
            const index = this._randomMinMax(0, cards.length);
            const drawnCard = cards.splice(index, 1);
            deck.push(...drawnCard);
        }
        return deck;
    }
    // dodaje elementy do przetrzymywania kart
    _addCardBoxesElements() {
        const divContainer = new DocumentFragment();
        for (let i = 0; i < 7; i++) {
            const div = document.createElement("div");
            div.classList.add("cards-box");
            div.style.left = `${i * 100}px`;
            const boxForCards = {
                element: div,
            };
            this.columns[i].setColumnPosition({ x: i * 100, y: 145 });
            this.columns[i].addCard([boxForCards]);
            divContainer.append(div);
        }
        this.container.append(divContainer);
    }
    // tworzę elementy dla kart od asa w górę
    _addAceUpBoxElements() {
        const divContainer = new DocumentFragment();
        this.columns
            .filter((col) => col.direction === "up")
            .forEach((col, i) => {
            const index = col.columnNum;
            const divAce = document.createElement("div");
            divAce.classList.add("above-as");
            divAce.style.left = `${300 + i * 100}px`;
            const aceBox = {
                element: divAce,
            };
            this.columns[index].setColumnPosition({ x: 300 + i * 100, y: 0 });
            this.columns[index].addCard([aceBox]);
            divContainer.append(divAce);
        });
        this.container.append(divContainer);
    }
    // tworzę i dodaje elementy reprezentujące karty
    _addCards() {
        const cards = new DocumentFragment();
        let cardsInColumn = 7;
        // row - potrzebuje do przesunięcia kart w poziomie i obliczenia idInColumn
        let row = 0;
        // index ostatniej karty w wierszu - potrzebuje do zwiększenia row i zmniejszenia cardsInColumn
        let whenChangeRow = 6;
        // potrzebuje do policzenia columnId
        let firstIdCardInColumn = 0;
        // losowane karty
        const deck = this._shuffleCards();
        deck.forEach((obj, id) => {
            const cContainer = document.createElement("div");
            const front = document.createElement("i");
            const back = document.createElement("i");
            const { color, value } = obj;
            // ustawienia wyglądu dla karty
            cContainer.setAttribute("id", `card-${id}`);
            cContainer.classList.add("card");
            front.classList.add("icon", "front");
            back.classList.add("icon", "back");
            front.style.backgroundImage = `url(../src/svg/${color}-${value}.svg)`;
            back.style.backgroundImage = "url(../src/svg/revers.svg)";
            cContainer.append(front);
            cContainer.append(back);
            // tworzę kartę
            const card = new Card(cContainer, color, value);
            // wartości potrzeben do określenia właściwości karty
            let visible = false, moves = false, columnId, idInColumn;
            // talia do gry
            if (id < 28) {
                // dla pierwszych kart w kolumnie ustaw to co niżej
                // whenChangeRow = index ostatniej karty w wierszu
                // id - whenChangeRow === 1 jest to zawsze osatana karta w kolumnie
                if (id === firstIdCardInColumn) {
                    visible = true;
                    moves = true;
                }
                idInColumn = row;
                columnId = id - firstIdCardInColumn + row;
                // zmieniam ustawienie wiersza i ilości kart w wierszu
                if (id === whenChangeRow) {
                    row += 1;
                    cardsInColumn -= 1;
                    firstIdCardInColumn = whenChangeRow + 1;
                    whenChangeRow += cardsInColumn;
                }
            }
            else {
                cContainer.classList.add("for-selection");
                columnId = 11;
                idInColumn = 0;
            }
            card
                .setVisible(visible)
                .setMoves(moves)
                .setColumnId(columnId)
                .setIdInColumn(idInColumn)
                .setPosition({ x: 0, y: 0 })
                .moveTo();
            this._cards.push(card);
            // dodaje kartę do odpowiedniaj kolumny
            this.columns[columnId].addCard([card]);
            cards.append(cContainer);
        });
        this.container.append(cards);
    }
    // ustawienie dla Card odpowiednich pozycji - z późnieniem
    _dealCards() {
        return __awaiter(this, void 0, void 0, function* () {
            let position;
            for (let card of this._cards) {
                yield this._sleep(90);
                if (card.columnId < 7) {
                    position = {
                        x: card.columnId * 100 + 5,
                        y: card.idInColumn * 50 + 100,
                    };
                }
                else {
                    break;
                }
                card.setPosition(position).moveTo();
            }
        });
    }
    // zwraca tablicę w formie tablicy kolumn, lecz zamiast Card są zwykłe obiekty
    _setObjectInColums(columns) {
        return columns.map((col) => {
            return col.cardsInColumn
                .filter((card) => card instanceof Card)
                .map((card) => (Object.assign({}, card)));
        });
    }
    // opóźnienie w wu=ykonywaniu kodu
    _sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // start gry
    startGame() {
        this._addCardBoxesElements();
        this._addAceUpBoxElements();
        this._addCards();
        this._dealCards();
        // ustalam pozycję dla kolumny 11
        this.columns[ColumnNum.ForSelection].setColumnPosition({ x: 0, y: 0 });
    }
    // zwraca kolumnę o danym numerze index
    getColumnByIndex(index) {
        return this.columns[index];
    }
    // zwraca mi piersze x kolumn
    getColumns(num) {
        return this.columns.slice(0, num);
    }
    // zapisuje ruch w historii
    setHistory(key) {
        const value = this._setObjectInColums(this.columns);
        this._historyOfMovements.set(key, value);
    }
    // odczytuje zapisane ruchy
    getHistory(key) {
        if (key >= 0) {
            const prevMovement = this._historyOfMovements.get(key);
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
                    const { element, color, value, isVisible, isMoved, columnId, idInColumn, position, } = elem;
                    let newCard = new Card(element, color, value);
                    newCard
                        .setVisible(isVisible)
                        .setMoves(isMoved)
                        .setColumnId(columnId)
                        .setIdInColumn(idInColumn)
                        .setPosition(position)
                        .moveTo();
                    // dodaje kartę do odpowiedniej kolumny
                    this.columns[columnId].addCard([newCard]);
                    this._cards.push(newCard);
                });
            });
        }
        else {
            alert("Nie możesz cofnąć!");
        }
    }
    // znajduje kartę na posdtawie elementu DOM
    findCard(element) {
        return this._cards.find((c) => c.element === element);
    }
    // sprawdza czy gra została ukończona powodzeniem
    gameResult() {
        let result = this.columns
            .filter((col) => col.direction === "up")
            .every((col) => col.cardsInColumn.length === 14);
        if (result) {
            // cas na ukończenie animacji
            setTimeout(() => {
                alert("You win!");
            }, 600);
        }
    }
    // umożliwia autouzupełnienie kolumn "UP"
    autocompleteCards() {
        // biorę tylko kolumny do których rozdaję karty na poczatku (index: 0-6)
        let allCardsAreVisible = this._cards
            .filter((card) => card.columnId < 7)
            .every((card) => card.isVisible === true);
        if (allCardsAreVisible) {
            const columnsWithPlayingCards = this.columns.slice(0, 7);
            const columnsAceUp = this.columns.filter((col) => col.direction === "up");
            const columnsWithSelectionCards = this.columns.slice(11);
            const btn = document.createElement("button");
            btn.textContent = "Autocomplete";
            btn.classList.add("autocomplete", "btn");
            this.container.append(btn);
            btn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                // dopóki długość 4 kolumn AceUp nie jest rowna 14 to chce układać karty
                // 14 bo 13 kart jednego koluoru + 1 element początkowy w kolumnie
                while (columnsAceUp[0].cardsInColumn.length !== 14 ||
                    columnsAceUp[1].cardsInColumn.length !== 14 ||
                    columnsAceUp[2].cardsInColumn.length !== 14 ||
                    columnsAceUp[3].cardsInColumn.length !== 14) {
                    for (let i = 0; i < columnsAceUp.length; i++) {
                        let nextColors = columnsAceUp[i].nextCard.colors;
                        let nextValue = columnsAceUp[i].nextCard.value;
                        for (let k = 0; k < columnsWithPlayingCards.length; k++) {
                            if (columnsWithPlayingCards[k].cardsInColumn.length > 1) {
                                const lastCard = columnsWithPlayingCards[k].getLastCard();
                                const lastColor = lastCard.color;
                                const lastValue = lastCard.value;
                                // jeśli karta pasuje to ...
                                if (nextColors.includes(lastColor) && nextValue === lastValue) {
                                    yield this._sleep(110);
                                    // do kolumny "UP" dodaj lastCard
                                    // z columny columnsWithPlayingCards usuń element o indeksie lastCard.idInColumn
                                    columnsAceUp[i].moveIfPossible([lastCard], columnsWithPlayingCards[k], lastCard.idInColumn);
                                    // nadpisz wartość dla 'i' i dla 'k' żeby pętla zaczęła od początku
                                    i = 0;
                                    k = 0;
                                    // nadpisz nextColor i nextValue
                                    nextColors = columnsAceUp[i].nextCard.colors;
                                    nextValue = columnsAceUp[i].nextCard.value;
                                }
                            }
                        }
                    }
                    const lengthFirstSelectionCol = columnsWithSelectionCards[0].cardsInColumn.length;
                    const lengthSecondSelectionCol = columnsWithSelectionCards[1].cardsInColumn.length;
                    // ilość kart w obydwu kolumnach 'do doboru'
                    const lengthSelectionColumn = lengthFirstSelectionCol + lengthSecondSelectionCol;
                    //licznik kontrolujący ilośc sprawdzonych kart
                    let counter = 0;
                    while (counter < lengthSelectionColumn) {
                        // jeśli kolumna do doboru jest pusta to dodaj do niej kartę
                        if (lengthSecondSelectionCol === 0) {
                            // dodaje ostatnią kartą z kolumny z indexem 0 do kolumny z indexem 1
                            yield this._sleep(110);
                            columnsWithSelectionCards[1].getNextCardFrom(columnsWithSelectionCards[0]);
                        }
                        const lastCard = columnsWithSelectionCards[1].getLastCard();
                        const lastColor = lastCard.color;
                        const lastValue = lastCard.value;
                        // true - jeśli znajdzie pasującą kartę - dalej przerywa pętle
                        let hasFound = false;
                        for (let j = 0; j < columnsAceUp.length; j++) {
                            const nextColors = columnsAceUp[j].nextCard.colors;
                            const nextValue = columnsAceUp[j].nextCard.value;
                            // jeśli karta z 'do doboru' pasuje to ...
                            if (nextColors.includes(lastColor) && nextValue === lastValue) {
                                yield this._sleep(110);
                                // do kolumny "UP" dodaj lastCard
                                // z columny columnsWithSelectionCards usuń element o indeksie lastCard.idInColumn
                                columnsAceUp[j].moveIfPossible([lastCard], columnsWithSelectionCards[1], lastCard.idInColumn);
                                // porusz resztę kart w "do doboru"
                                columnsWithSelectionCards[1].moveCards();
                                // znalazłem więc kończę pętle while
                                hasFound = true;
                                // przerwij pętle
                                break;
                            }
                        }
                        // zakończ pętle, znalazłem kartę pasującą
                        if (hasFound)
                            break;
                        // jesli nie znalazł
                        // to bierze następną kartę jeśli może
                        if (lengthFirstSelectionCol > 0) {
                            yield this._sleep(110);
                            // dodaje ostatnią kartą z kolumny z indexem 0 do kolumny z indexem 1
                            columnsWithSelectionCards[1].getNextCardFrom(columnsWithSelectionCards[0]);
                        }
                        else {
                            yield this._sleep(110);
                            // jeśli nie może wziąć następnej karty to przekłada z kolumnny 1 do 0
                            columnsWithSelectionCards[0].moveCardsBack(columnsWithSelectionCards[1]);
                        }
                        counter++;
                    }
                }
                this.gameResult();
            }));
        }
    }
}
