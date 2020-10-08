import { IColumn } from "./IColumn";

export interface ICard {
  element: HTMLDivElement;
  color: string;
  value: number;
  columnId: number;
  idInColumn: number;
  isVisible: boolean;
  isMoved: boolean;
  position: { x: number; y: number };

  move(e: MouseEvent, position: IPosition, index: number): void;
  moveTo(): void;
  checkIfFits(elem: ICard, column: IColumn): boolean;
  setPosition(position: IPosition): this;
  setColumnId(collumnId: number): this;
  setIdInColumn(id: number): this;
  setVisible(value: boolean): this;
  setMoves(value: boolean): this;
}

export interface IPosition {
  x: number;
  y: number;
}
