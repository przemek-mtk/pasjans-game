export class Movements {
    constructor(container) {
        this.container = container;
        // licznik wykonanych ruchów
        this._movements = 0;
        this._setMovementsContext();
    }
    //odpowiada za zmianę zawartości div#movments
    _setMovementsContext() {
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
