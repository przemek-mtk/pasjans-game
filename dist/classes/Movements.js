export class Movements {
    constructor(container) {
        this.container = container;
        // licznik wykonanych ruchów
        this.movements = 0;
        this.setMovementsContext();
    }
    //odpowiada za zmianę zawartości div#movments
    setMovementsContext() {
        this.container.textContent = "Moves: " + this.movements.toString();
    }
    // resetuje przy nowej grze
    resetState() {
        this.movements = 0;
    }
    // zwiększam ilosć ruchów
    increaseState() {
        this.movements += 1;
        // this.container.textContent = "Moves: " +  this.movements.toString();
        this.setMovementsContext();
    }
}
