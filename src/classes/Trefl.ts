import { IColor } from "../interfaces/IColor.js";

export class Trefl implements IColor {
  constructor(readonly color: string, readonly value: number) {}
}
