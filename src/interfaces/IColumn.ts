import { ICards } from "./ICards";

export interface IColumn {
  addCard(card: ICards[]): void;
  removeCards(id: number): void;
  getCards(id: number): ICards[] | [];
  getCardId(card: ICards): number;
}
