import { Column } from "./Column.js";
var ColumnNum;
(function (ColumnNum) {
    ColumnNum[ColumnNum["ForSelection"] = 11] = "ForSelection";
})(ColumnNum || (ColumnNum = {}));
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
    // columny z indexem  7-10 są dla kart od asa w górę
    // zwraca [0,1,2,3,4, ..., 13]
    getArray() {
        return [...Array(13).keys()];
    }
    // losowa liczba <min, max>
    randomMinMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // zwraca tablicę 52 obiektów [{color: "", value: (random)},  ....]
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
            .map((e) => {
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
    // dodaje elementy do przetrzymywania kart
    addCardBoxesElements() {
        const cardBoxes = new DocumentFragment();
        for (let i = 0; i < 7; i++) {
            const box = document.createElement("div");
            box.classList.add("cards-box", "special");
            box.style.top = `${145}px`;
            box.style.left = `${95 + i * 100}px`;
            this.columns[i].addCard([box]);
            cardBoxes.append(box);
        }
        return cardBoxes;
    }
    // tworzę elementy dla kart od asa w górę
    addAceUpBoxElements() {
        const aceUpBoxes = new DocumentFragment();
        this.columns
            .filter((col) => col.direction === "up")
            .forEach((col, i) => {
            const index = col.columnNum;
            const aAs = document.createElement("div");
            aAs.classList.add("above-as", "special");
            aAs.style.top = `${0}px`;
            aAs.style.right = `${i * 100}px`;
            this.columns[index].addCard([aAs]);
            aceUpBoxes.append(aAs);
        });
        return aceUpBoxes;
    }
    // tworzę i dodaje elementy reprezentujące karty
    addCards() {
        const cards = new DocumentFragment();
        let column = 7;
        let lastIdInRow = 0;
        let row = 0;
        this.cards.forEach((elem, id) => {
            let card = document.createElement("div");
            let cColor = document.createElement("p"); // to jest do wyszucenia! - chyba
            let cValue = document.createElement("p"); // to jest do wyszucenia! - chyba
            const { color, value } = elem;
            cColor.innerText = color;
            cValue.innerText = value.toString();
            card.classList.add("card", "invisible");
            card.setAttribute("id", `card-${id}`);
            card.dataset.color = color;
            card.dataset.value = value.toString();
            //te są dodawane do 'gry' reszta do 'doboru'
            if (id < 28) {
                const top = row * 100; // do zmiany
                const left = (id - lastIdInRow + row) * 100;
                const indexColumn = id - lastIdInRow + row;
                this.columns[indexColumn].addCard([card]);
                card.style.top = `${150 + top}px`;
                card.style.left = `${100 + left}px`;
                //zmiana visible dla konkretnych kart, które są ostatnimi w swojej columnie
                if (id == lastIdInRow) {
                    card.classList.add("visible", "moved");
                    card.classList.remove("invisible");
                }
                if ((id - lastIdInRow) % column === column - 1 && column > 1) {
                    lastIdInRow = id + 1;
                    column--;
                    row++;
                }
            }
            else {
                card.classList.add("for-selection");
                this.columns[ColumnNum.ForSelection].addCard([card]);
            }
            card.append(cColor);
            card.append(cValue);
            cards.append(card);
        });
        return cards;
    }
    startGame() {
        //losuje karty
        this.cards = this.randomCards();
        const container = document.querySelector("#container");
        const cardBoxes = this.addCardBoxesElements();
        const aceUpBoxes = this.addAceUpBoxElements();
        const cards = this.addCards();
        container.append(aceUpBoxes);
        container.append(cardBoxes);
        container.append(cards);
    }
    // zwraca klikniętą kolumnę
    getColumn(data) {
        return this.columns.find((col) => col.getCardId(data) > -1);
    }
}
