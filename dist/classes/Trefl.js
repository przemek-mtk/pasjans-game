import { Black } from "./Black.js";
export class Trefl extends Black {
    constructor(color, value, visible, position = { x: 0, y: 0 }) {
        super(value, visible, position);
        this.color = color;
        this.value = value;
        this.visible = visible;
        this.position = position;
    }
}
