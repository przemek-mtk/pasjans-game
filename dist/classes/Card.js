export class Card {
    constructor(value, visible) {
        this.value = value;
        this.visible = visible;
    }
    setVisibleToTrue() {
        this.visible = true;
    }
    setVisibleToFalse() {
        this.visible = false;
    }
}
