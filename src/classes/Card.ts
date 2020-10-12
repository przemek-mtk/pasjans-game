import { ICard, IPosition } from "../interfaces/ICard";
import { IColumn } from "../interfaces/IColumn";

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
    this.element.style.transition = "all .3s ease";
    this.element.style.zIndex = (100  + this.idInColumn).toString();
    this.element.style.top = this.position.y + "px";
    this.element.style.left = this.position.x + "px";

    setTimeout(() => {
      this.element.style.transition = "";
      this.element.style.zIndex = (10 + this.idInColumn).toString();

    }, 400);
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
      return true;
    } else if (
      card.top < bottom &&
      card.top > top &&
      card.right >= left &&
      card.right <= right
    ) {
      return true;
    } else if (
      card.bottom > top &&
      card.bottom < bottom &&
      card.right >= left &&
      card.right <= right
    ) {
      return true;
    } else if (
      card.bottom > top &&
      card.bottom < bottom &&
      card.left <= right &&
      card.left >= left
    ) {
      return true;
    } else {
      return false;
    }
  }
  // sprawdza czy karta najechała na inną kartę | miejsce specjalne
  // porównuje jej wartość z wartością jakiej oczekuje kolumna
  checkIfFits(elem: ICard, column: IColumn) {
    const fits = this._checkBorders(elem.element.getBoundingClientRect());
    if (fits) {
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
  // ustawia id columny dla Card
  setColumnId(collumnId: number) {
    this.columnId = collumnId;
    return this;
  }
  // ustawia id Card w kolumnie - które miejsce zajmuje
  setIdInColumn(id: number) {
    this.element.style.zIndex = (10 + id).toString();
    this.idInColumn = id;
    return this;
  }
  // ustawia isVisible na true/false + obraca kartę
  setVisible(value: boolean) {
    this.isVisible = value;
    // obracam kartę w zależności od wartości argumentu
    const firstChild = this.element.firstElementChild as HTMLElement;
    const secondChild = this.element.lastElementChild as HTMLElement;
    if (value) {
      firstChild.style.transform = "perspective(600px) rotateY(0deg)";
      secondChild.style.transform = "perspective(600px) rotateY(180deg)";
    } else {
      firstChild.style.transform = "perspective(600px) rotateY(-180deg)";
      secondChild.style.transform = "perspective(600px) rotateY(0deg)";
    }
    return this;
  }
  // ustawia isMoved na true/false
  setMoves(value: boolean) {
    this.isMoved = value;
    return this;
  }
}
