export class Card {
    constructor(card) {
        this.card = card;
        this.position = { x: 0, y: 0 };
    }
    // metoda do poruszania kartą
    move(e, position, index) {
        this.card.style.zIndex = "9999";
        this.card.style.top = e.clientY + position.y + 100 * index + "px";
        this.card.style.left = e.clientX + position.x + "px";
    }
    // metoda ustawiania karty w odpowiednim miejscu
    // albo wraca z powrotem, albo ląduje na karcie do której pasuje
    moveTo() {
        this.card.style.zIndex = "10";
        this.card.style.top = this.position.y + "px";
        this.card.style.left = this.position.x + "px";
    }
    //ustawienie odpowiedniej pozycji dla karty
    setPosition(pos) {
        this.position = pos;
        return this;
    }
    // metoda sprawdza czy puszczona karta ("mouseup") najechała jakokolwiek krawędzią na inną kartę
    checkBorders(card) {
        const { top, right, bottom, left } = this.card.getBoundingClientRect();
        if (card.top < bottom &&
            card.top > top &&
            card.left <= right &&
            card.left >= left) {
            // this.card.style.border = "2px solid #f0f";
            return true;
        }
        else if (card.top < bottom &&
            card.top > top &&
            card.right >= left &&
            card.right <= right) {
            // this.card.style.border = "2px solid #f0f";
            return true;
        }
        else if (card.bottom > top &&
            card.bottom < bottom &&
            card.right >= left &&
            card.right <= right) {
            // this.card.style.border = "2px solid #f0f";
            return true;
        }
        else if (card.bottom > top &&
            card.bottom < bottom &&
            card.left <= right &&
            card.left >= left) {
            // this.card.style.border = "2px solid #f0f";
            return true;
        }
        else {
            // this.card.style.border = "2px solid red";
            return false;
        }
    }
    // sprawdza czy karta najechała na inną kartę | miejsce specjalne 
    // porównuje jej wartość z wartością jakiej oczekuje kolumna
    checkIfFits(elem, column) {
        if (this.checkBorders(elem.getBoundingClientRect())) {
            const color = elem.dataset.color;
            const value = parseFloat(elem.dataset.value);
            if (column.nextCard.colors.includes(color) &&
                column.nextCard.value === value) {
                return elem;
            }
            return;
        }
    }
}
