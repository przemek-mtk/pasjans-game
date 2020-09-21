import { Column } from "./Column.js";
export class Game {
    constructor() {
        // public column = {
        //   one: new Column(),
        //   two: new Column(),
        //   three: new Column(),
        //   four: new Column(),
        //   five: new Column(),
        //   six: new Column(),
        //   seven: new Column(),
        // };
        this.column = Array(7)
            .fill(null)
            .map((e) => new Column());
    }
    getArray() {
        // returned aray = [0,1,2,3,4, ..., 13]
        return [...Array(13).keys()];
    }
    randomMinMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    randomCards() {
        let color = ["pik", "trefl", "karo", "kier"];
        let cards = {
            pik: this.getArray(),
            trefl: this.getArray(),
            karo: this.getArray(),
            kier: this.getArray(),
        };
        return Array(52)
            .fill(null)
            .map((elem) => {
            let idColor = this.randomMinMax(0, color.length - 1);
            let cardColor = color[idColor];
            let idValue = this.randomMinMax(0, cards[cardColor].length - 1);
            let valueCard = cards[cardColor].splice(idValue, 1);
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
        const container = document.querySelector("#container");
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
                this.column[indexColumn].addCard([card]);
                cardDiv.style.top = `${100 + top}px`;
                cardDiv.style.left = `${100 + left}px`;
                //zmiana visible dla konkretnych kart, które są ostatnimi w swoim stosie
                if (id == lastIdInRow) {
                    cardDiv.classList.add("visible");
                }
                else {
                    cardDiv.classList.add("invisible");
                }
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
}
