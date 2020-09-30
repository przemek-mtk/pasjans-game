import { ICards } from "./ICards";
import { IColumn } from "./IColumn";
import { ICard } from "./ICard";

export interface IGame {
  columns: IColumn[];
  startGame(): void;
  //czy get cards jest potrzebne??
  getCards(): ICard[];
  getColumn(data: ICards): IColumn | undefined;
  setObjectInColums(
    columns: IColumn[]
  ): {
    element: HTMLDivElement;
    color: string;
    value: number;
    columnId: number;
    idInColumn: number;
    isVisible: boolean;
    isMoved: boolean;
    // isLast: boolean;
    position: { x: number; y: number };
  }[][];
  getHistory(key: number): void;
  setHistory(key: number): void;
}
