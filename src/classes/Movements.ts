import { IMovements } from "../interfaces/IMovements";

export class Movements implements IMovements {
  // licznik wykonanych ruchów
  private movements: number = 0;

  constructor(private container: HTMLDivElement) {
    this.setMovementsContext();
  }

  //odpowiada za zmianę zawartości div#movments
  private setMovementsContext() {
    this.container.textContent = "Moves: " + this.movements.toString();
  }
  // resetuje przy nowej grze
  resetState() {
    this.movements = 0;
  }
  // zwiększam ilosć ruchów
  incrementState() {
    this.movements += 1;
    this.setMovementsContext();
  }

  decrementState() {
    if (this.movements > 0) {
      this.movements -= 1;
      this.setMovementsContext();
    }
  }

  getMovements() {
    return this.movements;
  }
}
