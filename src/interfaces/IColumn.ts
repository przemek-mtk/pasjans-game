import { ICards } from "./ICards";

export interface IColumn {
  nextCard: { colors: string[]; value: number };
  columnNum: number;
  addCard(card: HTMLDivElement[]): void;
  removeCards(id: number): void;
  getCardsBelow(id: number): HTMLDivElement[];
  getLastCard(): HTMLDivElement | null;
  getCardId(card: ICards): number;
  moveCards(): void;
}
