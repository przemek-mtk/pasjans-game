import { Card } from "./Card.js";
export class Pik extends Card {
    constructor(color, value, visible) {
        super(visible);
        this.color = color;
        this.value = value;
        this.visible = visible;
    }
    takeWhatFits() {
        return {
            value: this.value - 1,
            colors: ["kier", "karo"],
        };
    }
}
