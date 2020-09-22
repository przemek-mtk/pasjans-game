import { IGame } from "../interfaces/IGame";
import { ICards } from "../interfaces/ICards";
import { Column } from "./Column.js";
import { IColumn } from "../interfaces/IColumn";

export class Game implements IGame {
  private cards: ICards[] = [];
  // public column = {
  //   one: new Column(),
  //   two: new Column(),
  //   three: new Column(),
  //   four: new Column(),
  //   five: new Column(),
  //   six: new Column(),
  //   seven: new Column(),
  // };
  public columns = Array(7)
    .fill(null)
    .map((e, i) => new Column(i));

  private getArray(): number[] {
    // returned aray = [0,1,2,3,4, ..., 13]
    return [...Array(13).keys()];
  }

  private randomMinMax(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private randomCards(): ICards[] {
    let color: string[] = ["pik", "trefl", "karo", "kier"];
    let cards: {
      [key: string]: number[];
      pik: number[];
      trefl: number[];
      karo: number[];
      kier: number[];
    } = {
      pik: this.getArray(),
      trefl: this.getArray(),
      karo: this.getArray(),
      kier: this.getArray(),
    };

    return Array(52)
      .fill(null)
      .map((elem) => {
        let idColor: number = this.randomMinMax(0, color.length - 1);
        let cardColor: string = color[idColor];
        let idValue: number = this.randomMinMax(0, cards[cardColor].length - 1);
        let valueCard: number[] = cards[cardColor].splice(idValue, 1);

        if (cards[cardColor].length === 0) {
          color.splice(idColor, 1);
        }

        return {
          color: cardColor,
          value: valueCard[0],
        };
      });
  }

  startGame() {
    //losuje karty
    this.cards = this.randomCards();

    //dodaje karty do body
    // w pozycji :
    // ***
    //  **
    //   *
    const container = document.querySelector("#container")!;
    const cards = new DocumentFragment();

    let row = 7;
    let lastIdInRow = 0;
    let iterator = 0;

    this.cards.forEach((card, id) => {
      //  to mogę wyrzucić gdzie indziej!!!!
      let cardDiv = document.createElement("div");
      let color = document.createElement("p");
      let value = document.createElement("p");

      cardDiv.classList.add("card");
      cardDiv.setAttribute("id", `card-${id}`);
      cardDiv.dataset.color = card.color;
      cardDiv.dataset.value = card.value.toString();

      color.innerText = card.color;
      value.innerText = card.value.toString();

      //te są dodawane do 'gry' reszta do 'doboru
      if (id < 28) {
        let top = iterator * 100;
        let left = (id - lastIdInRow + iterator) * 100;

        let indexColumn = id - lastIdInRow + iterator;
        // this.columns[indexColumn].addCard([card]);
        this.columns[indexColumn].addCard([cardDiv]);

        cardDiv.style.top = `${100 + top}px`;
        cardDiv.style.left = `${100 + left}px`;

        //zmiana visible dla konkretnych kart, które są ostatnimi w swoim stosie
        cardDiv.classList.add("visible");

        // if (id == lastIdInRow) {
        //   cardDiv.classList.add("visible");
        // } else {
        //   cardDiv.classList.add("invisible");
        // }

        if ((id - lastIdInRow) % row === row - 1 && row > 1) {
          lastIdInRow = id + 1;
          row--;
          iterator++;
        }
      }

      cardDiv.append(color);
      cardDiv.append(value);
      cards.append(cardDiv);
    });

    container.append(cards);
    
  }

  //czemu metoda nie chce przyjąć zwracanej wartości jako IColumn?
  // zwraca klikniętą kolumnę
  getColumn(data: ICards): IColumn {
    return this.columns.find(col => col.getCardId(data) > -1);
  }
}
