import { IColumn } from "./IColumn";

export interface ICard {
  element: HTMLDivElement;
  color?: string;
  value?: number;
  columnId: number;
  idInColumn: number;
  isVisible: boolean;
  isMoved: boolean;
  position: IPosition;

  move(e: MouseEvent, position: IPosition, index: number): void;
  moveTo(): void;
  setPosition(position: IPosition): this;
  checkIfFits(elem: ICard, column: IColumn): boolean;
  setColumnId(collumnId: number): this;
  setIdInColumn(id: number): this;
  setVisible(value: boolean): this;
  setMoves(value: boolean): this;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IElement {
  element: HTMLDivElement
}