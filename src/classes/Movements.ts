import { IMovements } from "../interfaces/IMovements";

export class Movements implements IMovements {
  // licznik wykonanych ruchów
  private _movements: number = 0;

  constructor(private container: HTMLDivElement) {
    this._setMovementsContext();
  }

  //odpowiada za zmianę zawartości div#movments
  private _setMovementsContext() {
    this.container.textContent = "Moves: " + this._movements.toString();
  }
  // resetuje przy nowej grze
  resetState() {
    this._movements = 0;
  }
  // zwiększam ilosć ruchów
  incrementState() {
    this._movements += 1;
    this._setMovementsContext();
  }

  decrementState() {
    if (this._movements > 0) {
      this._movements -= 1;
      this._setMovementsContext();
    }
  }

  getMovements() {
    return this._movements;
  }
}
