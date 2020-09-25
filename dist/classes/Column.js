export class Column {
    constructor(columnNum, direction) {
        this.columnNum = columnNum;
        this.direction = direction;
        this.cardsInColumn = [];
        this.nextCard = {
            colors: ["kier", "karo", "pik", "trefl"],
            value: 0
        };
    }
    addCard(card) {
        this.cardsInColumn = this.cardsInColumn.concat(card);
        const lastCard = this.getLastCard();
        // ustawienie od Asa w górę
        if (this.direction === "up") {
            if (this.cardsInColumn.length === 2) {
                this.nextCard.colors = [lastCard.dataset.color];
                this.nextCard.value = this.nextCard.value + 1;
            }
            else if (this.cardsInColumn.length > 1) {
                this.nextCard.value = this.nextCard.value + 1;
            }
        }
        else {
            if ((lastCard === null || lastCard === void 0 ? void 0 : lastCard.dataset.color) === "pik" || (lastCard === null || lastCard === void 0 ? void 0 : lastCard.dataset.color) === "trefl") {
                this.nextCard.colors = ["kier", "karo"];
            }
            else {
                this.nextCard.colors = ["pik", "trefl"];
            }
            this.nextCard.value = parseFloat((lastCard === null || lastCard === void 0 ? void 0 : lastCard.dataset.value) - 1);
        }
    }
    removeCards(id) {
        this.cardsInColumn.splice(id);
        const lastCard = this.getLastCard();
        if (this.direction === "up") {
            // if(this.nextCard.colors.length) {
            // this.nextCard.colors.push(lastCard.dataset.color);
            // }
            this.nextCard.value = parseFloat(lastCard.dataset.value - 1);
        }
        else {
            if (this.cardsInColumn.length === 1) {
                this.nextCard.colors = ["kier", "karo", "pik", "trefl"];
            }
            else {
                if ((lastCard === null || lastCard === void 0 ? void 0 : lastCard.dataset.color) === "pik" || (lastCard === null || lastCard === void 0 ? void 0 : lastCard.dataset.color) === "trefl") {
                    this.nextCard.colors = ["kier", "karo"];
                }
                else {
                    this.nextCard.colors = ["pik", "trefl"];
                }
            }
            this.nextCard.value = parseFloat((lastCard === null || lastCard === void 0 ? void 0 : lastCard.dataset.value) - 1);
        }
    }
    // zwraca karty od klikniętej w dół
    getCardsBelow(id) {
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
    getCardId(data) {
        return this.cardsInColumn.findIndex((card) => card.dataset.color === data.color &&
            parseFloat(card.dataset.value) === data.value);
    }
    // porusza karty prawo-lewo w sekcji "dobór kart"
    moveCards() {
        let lastThree = this.getCardsBelow(0).slice(-3).reverse();
        lastThree.forEach((elem, i) => {
            elem.style.left = `${100 + i * 100}px`;
            if (i == 0) {
                elem.classList.add("moved");
            }
            else {
                elem.classList.remove("moved");
            }
        });
    }
}
