export class Column {
    constructor(columnNum, direction) {
        this.columnNum = columnNum;
        this.direction = direction;
        // private cardsInColumn: HTMLDivElement[] = [];
        this.cardsInColumn = [];
        this.nextCard = {
            colors: ["kier", "karo", "pik", "trefl"],
            value: 0,
        };
    }
    // ustala jaka jest będzie następna karta
    setNextCard() {
        const lastCard = this.getLastCard(); // as HTMLDivElement;
        let blackColor = ["pik", "trefl"];
        let redColor = ["kier", "karo"];
        if (this.cardsInColumn.length === 1) {
            this.nextCard.colors = blackColor.concat(redColor);
            this.nextCard.value = this.direction === "up" ? 0 : 12;
        }
        else if (this.cardsInColumn.length > 1) {
            // kolumny "do doboru" nie potrzebują takich informacji
            if (this.direction === "up") {
                this.nextCard.colors = [lastCard.color];
                this.nextCard.value = this.nextCard.value + 1;
            }
            else {
                this.nextCard.colors = blackColor.includes(lastCard.color)
                    ? redColor
                    : blackColor;
                this.nextCard.value = parseFloat(lastCard.value) - 1;
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
        return this.cardsInColumn.findIndex((card) => card.color === data.color && parseFloat(card.value) === data.value);
    }
    // porusza karty prawo-lewo w sekcji "dobór kart"
    moveCards() {
        let lastThree = this.getCardsBelow(0).slice(-3).reverse();
        lastThree.forEach((elem, i) => {
            // elem.element.style.left = `${100 + i * 100}px`;
            let pos = { x: 100 + i * 100, y: 0 };
            elem.setPosition(pos);
            elem.moveTo();
            // to jest do poprawy jak najbardziej!!!
            // to jest do poprawy jak najbardziej!!!
            // to jest do poprawy jak najbardziej!!!
            // to jest do poprawy jak najbardziej!!!
            // to jest do poprawy jak najbardziej!!!
            // to jest do poprawy jak najbardziej!!!
            // to jest do poprawy jak najbardziej!!!
            // JAK COFAM NIE MOGĘ RUSZYĆ KARTĄ!!
            if (i == 0) {
                // pozwala na przeniesienie karty
                elem.element.classList.add("moved");
            }
            else {
                elem.element.classList.remove("moved");
            }
        });
    }
}
