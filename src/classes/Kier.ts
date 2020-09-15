import { IColor } from "../interfaces/IColor.js";

export class Kier implements IColor {
  constructor(readonly color: string, readonly value: number) {}
}
