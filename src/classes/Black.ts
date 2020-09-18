import { Card } from "./Card.js";
import { IColor } from "../interfaces/IColor.js";

export class Black extends Card implements IColor {
  constructor(readonly value: number, public visible: boolean) {
    super(value, visible);
  }

  takeWhatFits() {
    return {
      value: this.value - 1,
      colors: ["kier", "karo"],
    };
  }
}