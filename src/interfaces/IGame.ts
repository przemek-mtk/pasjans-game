import {IColor} from "./IColor.js"

export interface IGame {
  //metody prywatne
  // getArray(): number[];
  // radnomMinMax(min:number, max:number): number;
  // randomCards(): IColor[];

  // rozpoczyna grę - losuje karty
  startGame(): void;
  // rozdanie kart do odpowiednich miejsc
  render(elem: HTMLDivElement, howMany: number, visibilityLastElem: boolean): void;
}