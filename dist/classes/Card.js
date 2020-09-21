export class Card {
    constructor(value, visible, position = { x: 0, y: 0 }) {
        this.value = value;
        this.visible = visible;
        this.position = position;
    }
    setVisibleToTrue() {
        this.visible = true;
    }
    setVisibleToFalse() {
        this.visible = false;
    }
    //nie jest zapisana w interface
    setPosition(pos) {
        this.position = pos;
    }
}
