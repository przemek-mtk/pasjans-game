import { IColor } from "../interfaces/IColor.js";

export class Karo implements IColor {
  constructor(readonly color: string, readonly value: number) {}
}
