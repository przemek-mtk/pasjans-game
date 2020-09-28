import { IColumn } from "../interfaces/IColumn";
import { ICards } from "../interfaces/ICards";

export class Column implements IColumn {
  private cardsInColumn: HTMLDivElement[] = [];
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
  private setNextCard(): void {
    const lastCard = this.getLastCard() as HTMLDivElement;
    let blackColor = ["pik", "trefl"];
    let redColor = ["kier", "karo"];

    if (this.cardsInColumn.length === 1) {
      this.nextCard.colors = blackColor.concat(redColor);
      this.nextCard.value = this.direction === "up" ? 0 : 12;
    } else {
      if (this.direction === "up") {
        this.nextCard.colors = [lastCard.dataset.color!];
        this.nextCard.value = this.nextCard.value + 1;
      } else {
        this.nextCard.colors = blackColor.includes(lastCard.dataset.color!)
          ? redColor
          : blackColor;
        this.nextCard.value = parseFloat(lastCard.dataset.value!) - 1;
      }
    }
  }

  addCard(card: HTMLDivElement[]) {
    this.cardsInColumn = this.cardsInColumn.concat(card);

    // ustalam jaka będzie następna karta
    this.setNextCard();
  }

  removeCards(id: number) {
    this.cardsInColumn.splice(id);

    // ustalam jaka będzie następna karta
    this.setNextCard();
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

  // zwraca index klikniętej karty
  getCardId(data: ICards) {
    return this.cardsInColumn.findIndex(
      (card) =>
        card.dataset.color === data.color &&
        parseFloat(card.dataset.value!) === data.value
    );
  }

  // porusza karty prawo-lewo w sekcji "dobór kart"
  moveCards() {
    let lastThree = this.getCardsBelow(0).slice(-3).reverse();
    lastThree.forEach((elem, i) => {
      elem.style.left = `${100 + i * 100}px`;
      if (i == 0) {
        // pozwala na przeniesienie karty
        elem.classList.add("moved");
      } else {
        elem.classList.remove("moved");
      }
    });
  }
}
