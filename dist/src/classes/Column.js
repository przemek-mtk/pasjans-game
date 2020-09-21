export class Column {
    constructor() {
        this.cardsInColumn = [];
    }
    addCard(card) {
        this.cardsInColumn = this.cardsInColumn.concat(card);
    }
    removeCard(id) {
        this.cardsInColumn.splice(id);
    }
    getCards() {
        return this.cardsInColumn;
    }
}
