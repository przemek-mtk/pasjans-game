import { ICard } from "../interfaces/ICard.js";

export class Cart implements ICard {
  constructor(public visible: boolean) {}

  setVisibleToTrue() {
    this.visible = true;
  }
  
  setVisibleToFalse() {
    this.visible = false;
  }
}


