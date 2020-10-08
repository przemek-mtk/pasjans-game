import { ICard, IPosition } from "../interfaces/ICard";
import { IColumn } from "../interfaces/IColumn";
import { ICards } from "../interfaces/ICards";

export class Card implements ICard {
  public position: IPosition = { x: 0, y: 0 };
  public columnId: number = 0;
  public idInColumn: number = 0;
  public isVisible: boolean = false;
  public isMoved: boolean = false;

  constructor(
    public readonly element: HTMLDivElement,
    public color?: string,
    public value?: number
  ) {}

  // metoda do poruszania kartą
  move(e: MouseEvent, position: IPosition, index: number) {
    this.element.style.zIndex = (9000 + this.idInColumn).toString();
    this.element.style.top = e.clientY + position.y + 50 * index + "px";
    this.element.style.left = e.clientX + position.x + "px";
  }

  // metoda ustawiania karty w odpowiednim miejscu
  // albo wraca z powrotem, albo ląduje na karcie do której pasuje
  moveTo() {
    this.element.style.zIndex = this.idInColumn.toString();
    this.element.style.top = this.position.y + "px";
    this.element.style.left = this.position.x + "px";
  }

  //ustawienie odpowiedniej pozycji dla karty
  setPosition(pos: IPosition) {
    this.position = pos;
    return this;
  }

  // metoda sprawdza czy puszczona karta ("mouseup") najechała jakokolwiek krawędzią na inną kartę
  private _checkBorders(card: {
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
  checkIfFits(elem: ICard, column: IColumn) {
    if (this._checkBorders(elem.element.getBoundingClientRect())) {
      const { color, value } = elem;

      if (
        column.nextCard.colors.includes(color!) &&
        column.nextCard.value === value
      ) {
        return true;
      }
    }
    return false;
  }

  setColumnId(collumnId: number) {
    this.columnId = collumnId;
    return this;
  }

  setIdInColumn(id: number) {
    this.element.style.zIndex = id.toString();
    this.idInColumn = id;
    return this;
  }

  setVisible(value: boolean) {
    this.isVisible = value;
    // obracam kartę w zależności od wartości argumentu
    if (value) {
      this.element.firstElementChild!.style.transform =
        "perspective(600px) rotateY(0deg)";
      this.element.lastElementChild!.style.transform =
        "perspective(600px) rotateY(180deg)";
    } else {
      this.element.firstElementChild!.style.transform =
        "perspective(600px) rotateY(-180deg)";
      this.element.lastElementChild!.style.transform =
        "perspective(600px) rotateY(0deg)";
    }
    return this;
  }

  setMoves(value: boolean) {
    this.isMoved = value;
    return this;
  }
}
