import { IColumn } from "./IColumn";

export interface ICard {
  move(e: Event, position: {x: number, y: number}, index: number): void;
  moveTo(): void;
  setPosition(position: {x: number, y: number}): ICard; 
  checkIfFits(elem: HTMLDivElement, column: IColumn): HTMLDivElement | undefined;
}

export interface IPosition {
  x: number,
  y: number
}