import { IColumn } from "./IColumn";
import { ICards } from "./ICards";

export interface ICard {
  element: HTMLDivElement;
  color: string;
  value: number;
  columnId: number;
  idInColumn: number;
  isVisible: boolean;
  isMoved: boolean;
  // isLast: boolean;
  position: { x: number; y: number };

  move(e: MouseEvent, position: IPosition, index: number): void;
  moveTo(): void;
  setPosition(position: IPosition): ICard;
  checkIfFits(
    elem: ICard,
    column: IColumn
  ): ICard | undefined;
  changeColumnId(collumnId: number): void;
  changeIdInColumn(id: number): void;
  // setIsLast(value: boolean): void;
  setIsVisible(value: boolean): void;
}

export interface IPosition {
  x: number;
  y: number;
}
