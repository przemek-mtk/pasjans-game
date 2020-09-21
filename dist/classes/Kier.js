import { Red } from "./Red.js";
export class Kier extends Red {
    constructor(color, value, visible, position = { x: 0, y: 0 }) {
        super(value, visible, position);
        this.color = color;
        this.value = value;
        this.visible = visible;
        this.position = position;
    }
}
