import { IColumn } from "./IColumn";
import { ICard, IPosition } from "./ICard";

export interface IGame {
  startGame(): void;
  getColumnByIndex(index: number): IColumn;
  getColumns(index: number): IColumn[];
  setHistory(key: number): void;
  getHistory(key: number): void;
  findCard(element: HTMLDivElement): ICard | undefined;
  gameResult(): void;
  autocompleteCards(): void;
}

export interface IObjectInColum {
  element: HTMLDivElement;
  color?: string;
  value?: number;
  columnId: number;
  idInColumn: number;
  isVisible: boolean;
  isMoved: boolean;
  position: IPosition;
}
