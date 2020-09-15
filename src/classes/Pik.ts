import { IColor } from "../interfaces/IColor.js";

export class Pik implements IColor {
  constructor(readonly color: string, readonly value: number) {}
}
