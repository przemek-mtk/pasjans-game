export class Card {
    constructor(element, color, value) {
        this.element = element;
        this.color = color;
        this.value = value;
        this.position = { x: 0, y: 0 };
        this.columnId = 0;
        this.idInColumn = 0;
        this.isVisible = false;
        this.isMoved = false;
    }
    // metoda do poruszania kartą
    move(e, position, index) {
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
    setPosition(pos) {
        this.position = pos;
        return this;
    }
    // metoda sprawdza czy puszczona karta ("mouseup") najechała jakokolwiek krawędzią na inną kartę
    _checkBorders(card) {
        const { top, right, bottom, left } = this.element.getBoundingClientRect();
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
        if (this._checkBorders(elem.element.getBoundingClientRect())) {
            const { color, value } = elem;
            if (column.nextCard.colors.includes(color) &&
                column.nextCard.value === value) {
                return true;
            }
        }
        return false;
    }
    setColumnId(collumnId) {
        this.columnId = collumnId;
        return this;
    }
    setIdInColumn(id) {
        this.element.style.zIndex = id.toString();
        this.idInColumn = id;
        return this;
    }
    setVisible(value) {
        this.isVisible = value;
        // obracam kartę w zależności od wartości argumentu
        if (value) {
            this.element.firstElementChild.style.transform =
                "perspective(600px) rotateY(0deg)";
            this.element.lastElementChild.style.transform =
                "perspective(600px) rotateY(180deg)";
        }
        else {
            this.element.firstElementChild.style.transform =
                "perspective(600px) rotateY(-180deg)";
            this.element.lastElementChild.style.transform =
                "perspective(600px) rotateY(0deg)";
        }
        return this;
    }
    setMoves(value) {
        this.isMoved = value;
        return this;
    }
}
