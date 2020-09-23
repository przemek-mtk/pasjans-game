export class Column {
    constructor(columnNum) {
        this.columnNum = columnNum;
        this.cardsInColumn = [];
    }
    addCard(card) {
        this.cardsInColumn = this.cardsInColumn.concat(card);
    }
    removeCards(id) {
        this.cardsInColumn.splice(id);
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
    // zwraca index klikniętej karty
    getCardId(data) {
        return this.cardsInColumn.findIndex((card) => card.dataset.color === data.color &&
            parseFloat(card.dataset.value) === data.value);
    }
    // porusza karty prawo-lewo w sekcji "dobór kart"
    moveCards() {
        let lastThree = this.getCardsBelow(0).slice(-3).reverse();
        lastThree.forEach((elem, i) => {
            elem.style.left = `${100 + i * 100}px`;
            if (i == 0) {
                elem.classList.add("moved");
            }
            else {
                elem.classList.remove("moved");
            }
        });
    }
}
