import { Black } from "./Black.js";
export class Trefl extends Black {
    constructor(color, value, visible) {
        super(value, visible);
        this.color = color;
        this.value = value;
        this.visible = visible;
    }
}
