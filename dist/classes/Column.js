import { Card } from "./Card.js";
export class Column {
    constructor(columnNum, direction = null) {
        this.columnNum = columnNum;
        this.direction = direction;
        this.cardsInColumn = [];
        this.isEmpty = true;
        this.nextCard = {
            colors: direction !== null ? ["kier", "karo", "pik", "trefl"] : [],
            value: 0,
        };
    }
    setColumnPosition(position) {
        this.position = position;
    }
    // ustala jaka jest będzie następna karta
    _setNextCard() {
        const lastCard = this.getLastCard(); // as HTMLDivElement;
        let blackColor = ["pik", "trefl"];
        let redColor = ["kier", "karo"];
        if (this.cardsInColumn.length === 1) {
            this.nextCard.colors = blackColor.concat(redColor);
            this.nextCard.value = this.direction === "up" ? 0 : 12;
        }
        else if (this.cardsInColumn.length > 1) {
            // kolumny "do doboru" nie potrzebują takich informacji
            if (this.direction === "up") {
                this.nextCard.colors = [lastCard.color];
                this.nextCard.value = this.nextCard.value + 1;
            }
            else {
                this.nextCard.colors = blackColor.includes(lastCard.color)
                    ? redColor
                    : blackColor;
                this.nextCard.value = parseFloat(lastCard.value) - 1;
            }
        }
    }
    addCard(card) {
        card.forEach((c, i) => {
            if (c instanceof Card) {
                c.setColumnId(this.columnNum);
                c.setIdInColumn(this.cardsInColumn.length + i);
                // c.setPosition({x: newPosition.x, y: newPosition.y}).moveTo()
            }
        });
        //dodaje karty do kolumny
        this.cardsInColumn = this.cardsInColumn.concat(card);
        // ustalam jaka będzie następna karta
        this._setNextCard();
        // ta kolumna nie jset pusta
        if (card[0] instanceof Card)
            this.isEmpty = false;
    }
    removeCards(id) {
        this.cardsInColumn.splice(id);
        // ustalam jaka będzie następna karta
        this._setNextCard();
        if (this.cardsInColumn.length === 1 && this.columnNum < 11) {
            this.isEmpty = true;
        }
        if (this.cardsInColumn.length === 0) {
            this.isEmpty = true;
        }
    }
    moveIfPossible(card, clickedColumn, id) {
        // warunek zapobiega dodawaniu do "od asa w górę" stosu kart
        if ((this.direction === "up" && card.length === 1) ||
            this.direction === "down") {
            let newPosition;
            if (this.isEmpty || this.direction === "up") {
                newPosition = { x: this.position.x + 5, y: this.position.y + 5 };
            }
            else {
                newPosition = {
                    x: this.getLastCard().position.x,
                    y: this.getLastCard().position.y + 50,
                };
            }
            card.forEach((c, i) => c
                .setPosition({
                x: newPosition.x,
                y: newPosition.y + i * 50,
            })
                .moveTo());
            // dodaje przenoszona karty do kolumny nad którą upuściłem
            this.addCard(card);
            // usuwam przeniesione karty ze starej kolumny
            clickedColumn.removeCards(id);
        }
        else {
            card.forEach((c) => c.moveTo());
            console.log("TO DZIAŁA PRAWDA??!?!?!?");
        }
    }
    // zwraca karty od klikniętej w dół
    getCardsBelow(id) {
        return this.cardsInColumn.slice(id);
    }
    //zwraca ostatnią kartę z columny jeśli istnieje
    getLastCard() {
        const colLength = this.cardsInColumn.length;
        if (colLength > 0) {
            return this.cardsInColumn[colLength - 1];
        }
        return null;
    }
    getFirstCard() {
        return this.cardsInColumn[0];
    }
    // metoda sprawdza czy karta pasuje do kolumny
    // czy można ją do niej dodać
    checkColumnForElement(card) {
        const { colors, value } = this.nextCard;
        if (colors.includes(card.color) && value === card.value) {
            return this;
        }
    }
    // metoda dla kolumny 11 - przenosi wszystkie karty z 12 do 11
    moveCardsBack(fromColumn) {
        const cards = fromColumn.getCardsBelow(0).reverse();
        cards.forEach((c) => {
            c.setPosition({ x: 0, y: 0 }).moveTo();
            c.setVisible(false);
            c.setMoves(false);
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
        lastThree.forEach((elem, i) => {
            // elem.element.style.left = `${100 + i * 100}px`;
            let pos = { x: 100 + i * 100, y: 0 };
            elem.setPosition(pos).moveTo();
            elem.setVisible(true);
            if (i == 0) {
                // pozwala na przeniesienie karty
                elem.setMoves(true);
                // elem.element.classList.add("moved");
            }
            else {
                elem.setMoves(false);
                // elem.element.classList.remove("moved");
            }
        });
    }
}
