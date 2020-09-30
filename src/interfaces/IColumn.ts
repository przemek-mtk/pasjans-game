import { ICards } from "./ICards";
import { ICard } from "./ICard";

export interface IColumn {
  cardsInColumn: ICard[];
  nextCard: { colors: string[]; value: number };
  columnNum: number;
  direction: "up" | "down";
  addCard(card: ICard[]): void;
  removeCards(id: number): void;
  getCardsBelow(id: number): ICard[];
  getLastCard(): ICard | null;
  getCardId(card: ICards): number;
  moveCards(): void;
}
