import { Column } from "./Column.js";
export class Game {
    constructor() {
        this.cards = [];
        this.columns = Array(13)
            .fill(null)
            .map((e, i) => {
            if (i > 6 && i < 11)
                return new Column(i, "up"); // kolumny dla kart od asa w górę
            return new Column(i, "down"); //reszta
        });
    }
    // columny z indexami 11 i 12 jest dla elementów mających klasę(CSS) "for-selection" - są to karty do dobrania w górynym lewym rogu
    // columny z indexem  7 8 9 10 jest dla kart od asa w górę
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
        const cardBoxes = new DocumentFragment();
        const repeat = document.createElement("div");
        repeat.classList.add("repeat");
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
            //dodaje elementy do przetrzymywania kart
            if (id < 7) {
                const box = document.createElement("div");
                box.dataset.value = "13";
                box.classList.add("cards-box");
                box.classList.add("special");
                box.style.top = `${145}px`;
                box.style.left = `${95 + id * 100}px`;
                this.columns[id].addCard([box]);
                cardBoxes.append(box);
            }
            cardDiv.classList.add("invisible");
            //te są dodawane do 'gry' reszta do 'doboru
            if (id < 28) {
                let top = iterator * 100;
                let left = (id - lastIdInRow + iterator) * 100;
                let indexColumn = id - lastIdInRow + iterator;
                // this.columns[indexColumn].addCard([card]);
                this.columns[indexColumn].addCard([cardDiv]);
                cardDiv.style.top = `${150 + top}px`;
                cardDiv.style.left = `${100 + left}px`;
                //zmiana visible dla konkretnych kart, które są ostatnimi w swoim stosie
                if (id == lastIdInRow) {
                    cardDiv.classList.add("visible");
                    cardDiv.classList.add("moved");
                    cardDiv.classList.remove("invisible");
                }
                if ((id - lastIdInRow) % row === row - 1 && row > 1) {
                    lastIdInRow = id + 1;
                    row--;
                    iterator++;
                }
            }
            if (id > 27) {
                cardDiv.classList.add("for-selection");
                this.columns[11].addCard([cardDiv]);
            }
            cardDiv.append(color);
            cardDiv.append(value);
            cards.append(cardDiv);
        });
        // tworzę columny dla kart od asa w górę
        const doc = new DocumentFragment();
        this.columns.slice(7, 11).forEach((col, i) => {
            const index = col.columnNum;
            const aAs = document.createElement("div");
            // aAs.dataset.value = "13";
            aAs.classList.add("above-as");
            aAs.classList.add("special");
            aAs.style.top = `${0}px`;
            aAs.style.right = `${i * 100}px`;
            this.columns[index].addCard([aAs]);
            doc.append(aAs);
        });
        container.append(repeat);
        container.append(doc);
        container.append(cardBoxes);
        container.append(cards);
    }
    // czemu metoda nie chce przyjąć zwracanej wartości jako IColumn?
    // zwraca klikniętą kolumnę
    getColumn(data) {
        return this.columns.find((col) => col.getCardId(data) > -1);
    }
}
