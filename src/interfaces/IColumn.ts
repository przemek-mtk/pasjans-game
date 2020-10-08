import { ICards } from "./ICards";
import { ICard } from "./ICard";

export interface IColumn {
  cardsInColumn: ICard[];
  nextCard: { colors: string[]; value: number };
  columnNum: number;
  direction: "up" | "down";
  addCard(card: ICard[]): void;
  removeCards(id: number): void;
  moveIfPossible(cards: ICard[], clickedColumn: IColumn, index: number): void;
  getFirstCard() : ICard;
  getCardsBelow(id: number): ICard[];
  getLastCard(): ICard | null;
  checkColumnForElement(card: ICard): this | undefined;
  moveCardsBack(column: IColumn): void;
  getNextCardFrom(column: IColumn): void
  moveCards(): void;
}
