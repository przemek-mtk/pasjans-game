import { ICard } from "../interfaces/ICard.js";

export class Card implements ICard {
  constructor(
    readonly value: number,
    public visible: boolean
  ) {}

  setVisibleToTrue() {
    this.visible = true;
  }

  setVisibleToFalse() {
    this.visible = false;
  }
}
