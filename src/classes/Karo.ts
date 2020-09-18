import { Red } from "./Red.js";

export class Karo extends Red {
  constructor(
    readonly color: string,
    readonly value: number,
    public visible: boolean
  ) {
    super(value, visible);
  }
}
