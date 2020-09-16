import { Card } from "./Card.js";
import { IColor } from "../interfaces/IColor.js";

export class Karo extends Card implements IColor {
  constructor(
    readonly color: string,
    readonly value: number,
    public visible: boolean
  ) {
    super(visible);
  }

  takeWhatFits() {
    return {
      value: this.value - 1,
      colors: ["trefl", "pik"],
    };
  }
}
