import { Card } from "./Card.js";
export class Red extends Card {
    constructor(value, visible) {
        super(value, visible);
        this.value = value;
        this.visible = visible;
    }
    takeWhatFits() {
        return {
            value: this.value - 1,
            colors: ["pik", "trefl"],
        };
    }
}
