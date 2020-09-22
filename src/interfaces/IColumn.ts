import { ICards } from "./ICards";

export interface IColumn {
  addCard(card: HTMLDivElement[]): void;
  removeCards(id: number): void;
  getCards(id: number): HTMLDivElement[];
  getLastCard(): HTMLDivElement | null;
  getCardId(card: ICards): number;
}
