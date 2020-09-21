import { ICard } from "./ICard";
import { IColumn } from "./IColumn";

export interface IGame {
  startGame(): void;
  getColumn(data: ICard): IColumn;
}