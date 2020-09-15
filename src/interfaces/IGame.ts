import {IColor} from "./IColor.js"

export interface IGame {
  getArray(): number[];
  radnomMinMax(min:number, max:number): number;
  randomCards(): IColor[];
}