import { ICard, IPosition, IElement } from "./ICard";

export interface IColumn {
  cardsInColumn: (ICard | { element: HTMLDivElement })[];
  nextCard: { colors: string[]; value: number };
  columnNum: number;
  direction: "up" | "down" | null;

  setColumnPosition(position: IPosition): void;
  addCard(cards: (ICard | IElement)[]): void;
  removeCards(id: number): void;
  moveIfPossible(cards: ICard[], clickedColumn: IColumn, index: number): void;
  getFirstCard(): ICard | IElement;
  getLastCard(): ICard | IElement | null;
  getCardsBelow(id: number): (ICard | IElement)[];
  checkColumnForElement(card: ICard): this | null;
  moveCardsBack(column: IColumn): void;
  getNextCardFrom(column: IColumn): void;
  moveCards(): void;
}
