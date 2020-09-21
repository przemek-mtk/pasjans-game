import { ICard } from "../interfaces/ICard";

export class Card implements ICard {
  constructor(private card: HTMLDivElement) {}
}
