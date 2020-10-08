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
        // property dla cofania
        this._historyOfMovements = new Map();
        this._createColumns();
    }
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
    // private history = {};
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
            cContainer.classList.add("card", "invisible");
            front.classList.add("icon", "front");
            back.classList.add("icon", "back");
            front.style.backgroundImage = `url(../src/svg/${color}-${value}.svg)`;
            back.style.backgroundImage = "url(../src/svg/revers.svg)";
            cContainer.append(front);
            cContainer.append(back);
            // tworzę kartę
            const card = new Card(cContainer, color, value);
            // wartości potrzeben do określenia właściwości karty
            let visible = false, moves = false, position = { x: 0, y: 0 }, columnId, idInColumn;
            // talia do gry
            if (id < 28) {
                // dla pierwszych kart w kolumnie ustaw to co niżej
                // whenChangeRow = index ostatniej karty w wierszu
                // id - whenChangeRow === 1 jest to zawsze osatana karta w kolumnie
                console.log(id, whenChangeRow);
                if (id === firstIdCardInColumn) {
                    console.log("hellooo");
                    visible = true;
                    moves = true;
                }
                idInColumn = row;
                columnId = id - firstIdCardInColumn + row;
                position = { x: columnId * 100 + 100, y: row * 50 + 150 };
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
                // .setVisible(true)
                .setMoves(moves)
                .setColumnId(columnId)
                .setIdInColumn(idInColumn)
                .setPosition(position)
                .moveTo();
            this._cards.push(card);
            // dodaje kartę do odpowiedniaj kolumny
            this.columns[columnId].addCard([card]);
            cards.append(cContainer);
        });
        this.container.append(cards);
    }
    startGame() {
        //losuje karty
        const cardBoxes = this._addCardBoxesElements();
        const aceUpBoxes = this._addAceUpBoxElements();
        // ustalam pozycję dla kolumny 11
        this.columns[ColumnNum.ForSelection].setColumnPosition({ x: 0, y: 0 });
        this.container.append(aceUpBoxes);
        this.container.append(cardBoxes);
        // this.container.append(cards);
        this._addCards();
    }
    // zwraca kolumnę o danym numerze index
    getColumnByIndex(num) {
        return this.columns[num];
    }
    // zwraca mi piersze x kolumn
    getColumns(num) {
        return this.columns.slice(0, num);
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
            const prevMovement = this._historyOfMovements.get(key);
            console.log("prevvvvMoveeee:", prevMovement, key);
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
                    let newCard = new Card(elem.element, elem.color, elem.value);
                    newCard
                        .setVisible(elem.isVisible)
                        .setMoves(elem.isMoved)
                        .setColumnId(elem.columnId)
                        .setIdInColumn(elem.idInColumn)
                        .setPosition(elem.position)
                        .moveTo();
                    // dodaje kartę do odpowiedniej kolumny
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
            .map((col) => {
            console.log(col.cardsInColumn.length);
            return col;
        })
            .every((col) => col.cardsInColumn.length === 14);
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
            const btn = document.createElement("button");
            btn.textContent = "Autouzupełnianie";
            this.container.append(btn);
            btn.addEventListener("click", (e) => {
                let y = 0;
                // dopóki długość 4 kolumn AceUp nie jest rowna 14 to chce coś robić
                // 14 bo 13 kart jednego koluoru + 1 element początkowy w kolumnie
                while (columnsAceUp[0].cardsInColumn.length !== 14 ||
                    columnsAceUp[1].cardsInColumn.length !== 14 ||
                    columnsAceUp[2].cardsInColumn.length !== 14 ||
                    columnsAceUp[3].cardsInColumn.length !== 14) {
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
                        }
                        q++;
                    }
                }
                this.gameResult();
            });
        }
        console.log(allPlayingCardsAreVisible);
    }
}
