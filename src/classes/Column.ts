import { IColumn } from "../interfaces/IColumn";
import { ICards } from "../interfaces/ICards";

export class Column implements IColumn {
  private cardsInColumn: ICards[] = [];

  constructor(readonly columnNum: number) {}

  addCard(card: ICards[]) {
    this.cardsInColumn = this.cardsInColumn.concat(card);
  }

  removeCards(id: number) {
    this.cardsInColumn.splice(id);
  }

  // zwraca karty od klikniętej w dół
  getCards(id: number) {
    return this.cardsInColumn.slice(id);
  }

  // zwraca index klikniętej karty
  getCardId(data: ICards) {
    return this.cardsInColumn.findIndex(
      (card) => card.color === data.color && card.value === data.value
    );
  }
}
