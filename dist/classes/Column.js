export class Column {
    constructor(columnNum, direction) {
        this.columnNum = columnNum;
        this.direction = direction;
        this.cardsInColumn = [];
        this.nextCard = {
            colors: ["kier", "karo", "pik", "trefl"],
            value: 0,
        };
    }
    // ustala jaka jest będzie następna karta
    setNextCard() {
        const lastCard = this.getLastCard();
        let blackColor = ["pik", "trefl"];
        let redColor = ["kier", "karo"];
        if (this.cardsInColumn.length === 1) {
            this.nextCard.colors = blackColor.concat(redColor);
            this.nextCard.value = this.direction === "up" ? 0 : 12;
        }
        else {
            if (this.direction === "up") {
                this.nextCard.colors = [lastCard.dataset.color];
                this.nextCard.value = this.nextCard.value + 1;
            }
            else {
                this.nextCard.colors = blackColor.includes(lastCard.dataset.color)
                    ? redColor
                    : blackColor;
                this.nextCard.value = parseFloat(lastCard.dataset.value) - 1;
            }
        }
    }
    addCard(card) {
        this.cardsInColumn = this.cardsInColumn.concat(card);
        // ustalam jaka będzie następna karta
        this.setNextCard();
    }
    removeCards(id) {
        this.cardsInColumn.splice(id);
        // ustalam jaka będzie następna karta
        this.setNextCard();
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
                // pozwala na przeniesienie karty
                elem.classList.add("moved");
            }
            else {
                elem.classList.remove("moved");
            }
        });
    }
}
