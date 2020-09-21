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
    // zwraca index klikniętej karty
    getCardId(data) {
        return this.cardsInColumn.findIndex((card) => card.color === data.color && card.value === data.value);
    }
}
