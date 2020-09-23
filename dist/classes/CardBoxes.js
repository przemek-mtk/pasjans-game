// import { ICardBoxes } from "../interfaces/ICard";
export class CardBoxes {
    constructor(box) {
        this.box = box;
    }
    // metoda sprawdza czy puszczona karta ("mouseup") najechała jakokolwiek rawędzią na kartę
    checkBorders(card) {
        const { top, right, bottom, left } = this.box.getBoundingClientRect();
        if (card.top < bottom &&
            card.top > top &&
            card.left <= right &&
            card.left >= left) {
            this.box.style.border = "2px solid #0ff";
            return true;
        }
        else if (card.top < bottom &&
            card.top > top &&
            card.right >= left &&
            card.right <= right) {
            this.box.style.border = "2px solid #0ff";
            return true;
        }
        else if (card.bottom > top &&
            card.bottom < bottom &&
            card.right >= left &&
            card.right <= right) {
            this.box.style.border = "2px solid #0ff";
            return true;
        }
        else if (card.bottom > top &&
            card.bottom < bottom &&
            card.left <= right &&
            card.left >= left) {
            this.box.style.border = "2px solid #0ff";
            return true;
        }
        else {
            this.box.style.border = "2px solid grey";
            return false;
        }
    }
    checkIfFits(elem) {
        console.log("box", elem);
        if (this.checkBorders(elem.getBoundingClientRect())) {
            console.log("najechałeś na BOXA!??!??");
            const value = parseFloat(elem.dataset.value);
            return value === parseFloat(this.box.dataset.value) - 1
                ? true
                : false;
        }
        return false;
    }
}
