import { Card } from "./Card.js";
export class Red extends Card {
    constructor(value, visible, position = { x: 0, y: 0 }) {
        super(value, visible, position);
        this.value = value;
        this.visible = visible;
        this.position = position;
    }
    takeWhatFits() {
        return {
            value: this.value - 1,
            colors: ["pik", "trefl"],
        };
    }
}
