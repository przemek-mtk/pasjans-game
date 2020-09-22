import { IColumn } from "../interfaces/IColumn";
import { ICards } from "../interfaces/ICards";

export class Column implements IColumn {
  private cardsInColumn: HTMLDivElement[] = [];

  constructor(readonly columnNum: number) {}

  addCard(card: HTMLDivElement[]) {
    this.cardsInColumn = this.cardsInColumn.concat(card);
  }

  removeCards(id: number) {
    this.cardsInColumn.splice(id);
  }

  // zwraca karty od klikniętej w dół
  getCards(id: number) {
    return this.cardsInColumn.slice(id);
  }

  //zwraca ostatnią kartę z columny jeśli istnieje
  getLastCard() {
    const colLength = this.cardsInColumn.length;

    if(colLength > 0) {
      return this.cardsInColumn[colLength - 1];
    }
    
    return null;
  }

  // zwraca index klikniętej karty
  getCardId(data: ICards) {
    return this.cardsInColumn.findIndex(
      (card) => card.dataset.color === data.color && parseFloat(card.dataset.value) === data.value
    );
  }
}
