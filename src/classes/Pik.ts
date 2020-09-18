import { Black } from "./Black.js";

export class Pik extends Black  {
  constructor(
    readonly color: string,
    readonly value: number,
    public visible: boolean,
  ) {
    super(value, visible);
  }
}
