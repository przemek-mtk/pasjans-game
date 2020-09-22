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
    getCards(id) {
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
        return this.cardsInColumn.findIndex((card) => card.dataset.color === data.color && parseFloat(card.dataset.value) === data.value);
    }
}
