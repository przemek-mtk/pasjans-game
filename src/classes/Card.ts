import { ICard } from "../interfaces/ICard";

export class Card implements ICard {
  private position: { x: number; y: number };

  constructor(private card: HTMLDivElement) {}

  // metoda do poruszania kartą
  move(e: Event, position: { x: number; y: number }, index: number) {
    this.card.style.zIndex = `${9999}`;
    this.card.style.top = e.clientY + position.y + 100 * index + "px";
    this.card.style.left = e.clientX + position.x + "px";
  }

  // metoda ustawiania karty w odpowiednim miejscu
  // albo wraca spowrotem, albo londuje na karcie do której pasuje
  moveTo() {
    this.card.style.zIndex = "10";
    this.card.style.top = this.position.y + "px";
    this.card.style.left = this.position.x + "px";
  }

  //ustawienie odpowiedniej pozycji dla karty
  setPosition(pos: { x: number; y: number }) {
    this.position = pos;
    return this;
  }

  // metoda sprawdza czy puszczona karta ("mouseup") najechała jakokolwiek rawędzią na kartę
  private checkBorders(card: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }) {
    const { top, right, bottom, left } = this.card.getBoundingClientRect();

    if (
      card.top < bottom &&
      card.top > top &&
      card.left <= right &&
      card.left >= left
    ) {
      this.card.style.border = "2px solid #f0f";
      return true;
    } else if (
      card.top < bottom &&
      card.top > top &&
      card.right >= left &&
      card.right <= right
    ) {
      this.card.style.border = "2px solid #f0f";
      return true;
    } else if (
      card.bottom > top &&
      card.bottom < bottom &&
      card.right >= left &&
      card.right <= right
    ) {
      this.card.style.border = "2px solid #f0f";
      return true;
    } else if (
      card.bottom > top &&
      card.bottom < bottom &&
      card.left <= right &&
      card.left >= left
    ) {
      this.card.style.border = "2px solid #f0f";
      return true;
    } else {
      this.card.style.border = "2px solid red";
      return false;
    }
  }

  // sprawdza czy karta najechała an inną kartę i na miejsce "specjalne" czylli box na którym leżą karty
  checkIfFits(elem: HTMLDivElement) {
    if (this.checkBorders(elem.getBoundingClientRect())) {
      const color = elem.dataset.color; //pik, trefl || kier, karo
      const value = parseFloat(elem.dataset.value);
      let rightColor;
      if (this.card.classList.contains("special")) {
        rightColor = ["kier", "karo", "pik", "trefl"];
      } else {
        rightColor =
          this.card.dataset.color === "pik" ||
          this.card.dataset.color === "trefl"
            ? ["kier", "karo"]
            : ["pik", "trefl"];
      }

      return rightColor.includes(color) &&
        value === parseFloat(this.card.dataset.value) - 1
        ? true
        : false;
    }

    return false;
  }
}
