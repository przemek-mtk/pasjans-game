import { ICards } from "./ICards";
import { IColumn } from "./IColumn";

export interface IGame {
  columns: IColumn[];
  startGame(): void;
  getColumn(data: ICards): IColumn | undefined
}
