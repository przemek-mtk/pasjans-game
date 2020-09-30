import { ICard, IPosition } from "../interfaces/ICard";
import { IColumn } from "../interfaces/IColumn";

export class Card implements ICard {
  public position: IPosition = { x: 0, y: 0 };

  constructor(
    public readonly element: HTMLDivElement,
    public color: string,
    public value: number,
    public columnId: number,
    public idInColumn: number,
    public isVisible: boolean = false,
    public isMoved: boolean = false,
    // public isLast: boolean = false
  ) {
    if(this.isVisible) {
      this.element.classList.add("visible", "moved");
      this.element.classList.remove("invisible");
    } else {
      this.element.classList.add("invisible");
      this.element.classList.remove("visible", "moved");
    }
    // this.moveTo();
  }

  // metoda do poruszania kartą
  move(e: MouseEvent, position: IPosition, index: number) {
    this.element.style.zIndex = "9999";
    this.element.style.top = e.clientY + position.y + 100 * index + "px";
    this.element.style.left = e.clientX + position.x + "px";
  }

  // metoda ustawiania karty w odpowiednim miejscu
  // albo wraca z powrotem, albo ląduje na karcie do której pasuje
  moveTo() {
    this.element.style.zIndex = "10"; 
    this.element.style.top = this.position.y + "px";
    this.element.style.left = this.position.x + "px";
  }

  //ustawienie odpowiedniej pozycji dla karty
  setPosition(pos: IPosition) {
    this.position = pos;
    return this;
  }

  // metoda sprawdza czy puszczona karta ("mouseup") najechała jakokolwiek krawędzią na inną kartę
  private checkBorders(card: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }) {
    const { top, right, bottom, left } = this.element.getBoundingClientRect();

    if (
      card.top < bottom &&
      card.top > top &&
      card.left <= right &&
      card.left >= left
    ) {
      // this.card.style.border = "2px solid #f0f";
      return true;
    } else if (
      card.top < bottom &&
      card.top > top &&
      card.right >= left &&
      card.right <= right
    ) {
      // this.card.style.border = "2px solid #f0f";
      return true;
    } else if (
      card.bottom > top &&
      card.bottom < bottom &&
      card.right >= left &&
      card.right <= right
    ) {
      // this.card.style.border = "2px solid #f0f";
      return true;
    } else if (
      card.bottom > top &&
      card.bottom < bottom &&
      card.left <= right &&
      card.left >= left
    ) {
      // this.card.style.border = "2px solid #f0f";
      return true;
    } else {
      // this.card.style.border = "2px solid red";
      return false;
    }
  }

  // sprawdza czy karta najechała na inną kartę | miejsce specjalne
  // porównuje jej wartość z wartością jakiej oczekuje kolumna
  checkIfFits(elem: HTMLDivElement, column: IColumn) {

    if (this.checkBorders(elem.getBoundingClientRect())) {
      const { color, value } = elem.dataset;

      if (
        column.nextCard.colors.includes(color!) &&
        column.nextCard.value === parseFloat(value!)
      ) {
        return elem;
      }

      return;
    }
  }

  // nowe metody:::
  // render() {
  //   let pos = {
  //     x: this.columnId < 12 ? 100 + this.columnId * 100 : 0,
  //     y: this.columnId < 12 ? 150 + this.idInColumn * 100 : 0,
  //   };
  //   this.setPosition(pos);
  //   this.moveTo();
  // }

  changeColumnId(collumnId: number) {
    this.columnId = collumnId;
  }

  changeIdInColumn(id: number) {
    this.idInColumn = id;
  }

  //   NIE WIME CZY POTRZEBUJE ISLAST !!!!
  // setIsLast(value: boolean) {
  //   this.isLast = value;
  // }

  
  setIsVisible() {
    this.isVisible = true;
    this.element.classList.add("visible", "moved");
    this.element.classList.remove("invisible");
  }
}
