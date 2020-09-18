import { Red } from "./Red.js";
export class Karo extends Red {
    constructor(color, value, visible) {
        super(value, visible);
        this.color = color;
        this.value = value;
        this.visible = visible;
    }
}
