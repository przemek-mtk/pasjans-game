export class Card {
    // public position: {x: number, y: number};
    constructor(color, value) {
        this.color = color;
        this.value = value;
    }
}
/*
const move = (e: Event, position: {top: number, left: number}, cardsToMove) => {
  cardsToMove.forEach((card, i) => {
    card.style.top = e.clientY + position.top + i * 100 + "px";
    card.style.left = e.clientX + position.left + "px";
  })

}
*/ 
