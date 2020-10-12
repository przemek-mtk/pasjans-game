import { Card } from "./Card.js";
export class Column {
    constructor(columnNum, direction = null) {
        this.columnNum = columnNum;
        this.direction = direction;
        this.cardsInColumn = [];
        this.isEmpty = true;
        this.position = { x: 0, y: 0 };
        this.nextCard = {
            colors: direction !== null ? ["kier", "karo", "pik", "trefl"] : [],
            value: 0,
        };
    }
    // ustala jaka jest będzie następna karta
    _setNextCard() {
        const lastCard = this.getLastCard();
        let blackColor = ["pik", "trefl"];
        let redColor = ["kier", "karo"];
        if (lastCard) {
            if (this.cardsInColumn.length === 1) {
                this.nextCard.colors = blackColor.concat(redColor);
                this.nextCard.value = this.direction === "up" ? 0 : 12;
            }
            else if (this.cardsInColumn.length > 1 && lastCard instanceof Card) {
                if (this.direction === "up") {
                    this.nextCard.colors = [lastCard.color];
                    this.nextCard.value = lastCard.value + 1;
                }
                else {
                    this.nextCard.colors = blackColor.includes(lastCard.color)
                        ? redColor
                        : blackColor;
                    this.nextCard.value = lastCard.value - 1;
                }
            }
        }
    }
    // ustala pozycję kolumny - potrzbene do ustalenia pozycji dla pierszyej Card w kolumnie
    setColumnPosition(position) {
        this.position = position;
    }
    // dodaje Card do kolumny
    addCard(cards) {
        cards.forEach((card, id) => {
            if (card instanceof Card) {
                card
                    .setColumnId(this.columnNum)
                    .setIdInColumn(this.cardsInColumn.length + id);
            }
        });
        //dodaje Card do kolumny
        this.cardsInColumn = this.cardsInColumn.concat(cards);
        // ustalam jaka będzie następna karta
        this._setNextCard();
        // ta kolumna nie jset pusta
        if (cards[0] instanceof Card)
            this.isEmpty = false;
    }
    // usuwam Card o podanym indeksie
    removeCards(id) {
        this.cardsInColumn.splice(id);
        // ustalam jaka będzie następna karta
        this._setNextCard();
        if (this.cardsInColumn.length === 1 && this.columnNum < 11) {
            this.isEmpty = true;
        }
    }
    // odpowiada za dodanie Card do kolumny na której wykonuje
    // tym samym odejmując Card o indeksie "id" z kolumny "clickedColumn"
    moveIfPossible(cards, clickedColumn, id) {
        // warunek zapobiega dodawaniu do "od asa w górę" stosu kart
        const lastCard = this.getLastCard();
        if ((this.direction === "up" && cards.length === 1) ||
            this.direction === "down") {
            let newPosition;
            if (this.isEmpty || this.direction === "up") {
                newPosition = { x: this.position.x + 5, y: this.position.y + 5 };
            }
            else if (lastCard instanceof Card) {
                newPosition = {
                    x: lastCard.position.x,
                    y: lastCard.position.y + 50,
                };
            }
            cards.forEach((card, id) => card
                .setPosition({
                x: newPosition.x,
                y: newPosition.y + id * 50,
            })
                .moveTo());
            // dodaje przenoszona karty do kolumny nad którą upuściłem element
            this.addCard(cards);
            // usuwam przeniesione karty ze starej kolumny
            clickedColumn.removeCards(id);
        }
        else {
            cards.forEach((card) => card.moveTo());
        }
    }
    // pobiera pierszy element z kolumny - objekt lub Card
    getFirstCard() {
        return this.cardsInColumn[0];
    }
    //zwraca ostatnią kartę z columny - jeśli istnieje
    getLastCard() {
        const colLength = this.cardsInColumn.length;
        if (colLength > 0) {
            return this.cardsInColumn[colLength - 1];
        }
        return null;
    }
    // zwraca karty od klikniętej w dół
    getCardsBelow(id) {
        return this.cardsInColumn.slice(id);
    }
    // metoda sprawdza czy karta pasuje do kolumny
    checkColumnForElement(card) {
        const { colors, value } = this.nextCard;
        if (colors.includes(card.color) && value === card.value) {
            return this;
        }
        return null;
    }
    // metoda dla kolumny 11 - przenosi wszystkie karty z 12 do 11
    moveCardsBack(fromColumn) {
        const cards = fromColumn.getCardsBelow(0).reverse();
        cards.forEach((card) => {
            card
                .setVisible(false)
                .setMoves(false)
                .setPosition({ x: 0, y: 0 })
                .moveTo();
        });
        fromColumn.removeCards(0);
        this.addCard(cards);
    }
    // metoda odpowiada za przenoszenie ostatniej karty z kolumny 11 do kolumny 12
    // kolumny "do doboru"
    getNextCardFrom(fromColumn) {
        // ostatnia karta z 11 kolumny
        const cardToAdd = fromColumn.getLastCard();
        // dodaję ją do tej kolumny (kolumna 12)
        this.addCard([cardToAdd]);
        // usuwam z kolumny ostatnią kartę -  to ta w którą klikam
        fromColumn.removeCards(-1);
        // ruszam ostatnie 3 karty jakie trafiły do kolumny 12 (Column.ForSelectionNext)
        this.moveCards();
    }
    // porusza karty prawo-lewo w sekcji "dobór kart"
    moveCards() {
        let lastThree = this.getCardsBelow(0).slice(-3).reverse();
        lastThree.forEach((card, id) => {
            let pos = { x: 80 + id * 67, y: 0 };
            card.setVisible(true).setPosition(pos).moveTo();
            if (id == 0) {
                // pozwala na przeniesienie karty
                card.setMoves(true);
            }
            else {
                card.setMoves(false);
            }
        });
    }
}
