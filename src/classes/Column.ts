import { IColumn } from "../interfaces/IColumn";
import { ICards } from "../interfaces/ICards";
import { ICard } from "../interfaces/ICard";
import { Card } from "./Card.js";

export class Column implements IColumn {
  // private cardsInColumn: HTMLDivElement[] = [];
  public cardsInColumn: ICard[] = [];
  public nextCard: { colors: string[]; value: number };

  constructor(
    readonly columnNum: number,
    public readonly direction: "up" | "down"
  ) {
    this.nextCard = {
      colors: ["kier", "karo", "pik", "trefl"],
      value: 0,
    };
  }

  // ustala jaka jest będzie następna karta
  private _setNextCard(): void {
    const lastCard = this.getLastCard(); // as HTMLDivElement;
    let blackColor = ["pik", "trefl"];
    let redColor = ["kier", "karo"];


    if (this.cardsInColumn.length === 1) {
      this.nextCard.colors = blackColor.concat(redColor);
      this.nextCard.value = this.direction === "up" ? 0 : 12;
    } else if (this.cardsInColumn.length > 1) {
      // kolumny "do doboru" nie potrzebują takich informacji
      if (this.direction === "up") {
        this.nextCard.colors = [lastCard.color!];
        this.nextCard.value = this.nextCard.value + 1;
      } else {
        this.nextCard.colors = blackColor.includes(lastCard.color!)
          ? redColor
          : blackColor;
        this.nextCard.value = parseFloat(lastCard.value!) - 1;
      }
    }
  }

  addCard(card: ICard[]) {
    // zmienima numer kolumny i miejsce w kolumnie dla każdej karty którą chce dodać do tej kolumny
    card.forEach((c, i) => {
      if (c instanceof Card) {
        c.changeColumnId(this.columnNum);
        c.changeIdInColumn(this.cardsInColumn.length + i);
      }
    });
    //dodaje karty do kolumny
    this.cardsInColumn = this.cardsInColumn.concat(card);

    // ustalam jaka będzie następna karta
    this._setNextCard();
  }

  removeCards(id: number) {
    this.cardsInColumn.splice(id);

    // ustalam jaka będzie następna karta
    this._setNextCard();
  }

  // zwraca karty od klikniętej w dół
  getCardsBelow(id: number) {
    return this.cardsInColumn.slice(id);
  }

  //zwraca ostatnią kartę z columny jeśli istnieje
  getLastCard() {
    const colLength = this.cardsInColumn.length;


    if (colLength > 0) {
      return this.cardsInColumn[colLength - 1];
    }
    return null;
  }

  getFirstCard() {
    return this.cardsInColumn[0]
  }

  // zwraca index klikniętej karty
  getCardId(data: ICards) {
    return this.cardsInColumn.findIndex(
      (card) =>
        card.color === data.color && parseFloat(card.value!) === data.value
    );
  }

  // porusza karty prawo-lewo w sekcji "dobór kart"
  moveCards() {
    
    let lastThree: ICard[] = this.getCardsBelow(0).slice(-3).reverse();
    lastThree.forEach((elem, i) => {
      // elem.element.style.left = `${100 + i * 100}px`;
      let pos = { x: 100 + i * 100, y: 0 };
      elem.setPosition(pos).moveTo();
      elem.setIsVisible(true);
      if (i == 0) {
        // pozwala na przeniesienie karty
        elem.setIsMoved(true);
        // elem.element.classList.add("moved");
      } else {
        elem.setIsMoved(false);
        // elem.element.classList.remove("moved");
      }
    });
  }
}
