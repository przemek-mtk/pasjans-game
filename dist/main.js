import { Game } from "./classes/Game.js";
let g = new Game();
g.startGame();
let currentCard;
const cards = Array.from(document.querySelectorAll(".card"));
cards.forEach(card => {
    //zapisywanie pozycji przy kliknieciu
    let mouseDownPosition;
    //dane karty
    const cardData = {
        color: card.dataset.color,
        value: Number(card.dataset.value),
    };
    //w taki sposób muszę to robić bo inaczej nie usuną eventu
    const m = (e) => move(e, mouseDownPosition, card);
    card.addEventListener("mousedown", (e) => {
        console.log("mousedown");
        currentCard = cardData;
        mouseDownPosition = { top: card.offsetTop - e.clientY, left: card.offsetLeft - e.clientX };
        window.addEventListener("mousemove", m);
    }, card.addEventListener("mouseup", (e) => {
        console.log("mouseup");
        currentCard = null;
        mouseDownPosition = null;
        window.removeEventListener("mousemove", m);
    }));
    // card.addEventListener("mouseover", (e: MouseEvent) => {
    //   console.log("MOUSEOVER:: ", cardData)
    // })
});
const move = (e, position, target) => {
    // const move = (e) => {
    let { top: targetTop, right: targetRight, bottom: targetBottom, left: targetLeft } = target.getBoundingClientRect();
    target.style.top = e.clientY + position.top + "px";
    target.style.left = e.clientX + position.left + "px";
    target.style.zIndex = "9999";
    // sprawdzam czy nie najechałem przez przypadek na jakoś inną kartę
    const visibleCards = Array.from(document.querySelectorAll(".visible"));
    visibleCards.forEach(vCard => {
        let { top, right, bottom, left } = vCard.getBoundingClientRect();
        console.log("l: ", targetLeft, "r: ", targetRight);
        if (targetTop < bottom && targetTop > top && targetLeft < right && targetLeft > left) {
            vCard.style.border = "2px solid #f0f";
        }
        else if (targetTop < bottom && targetTop > top && targetRight > left && targetRight < right) {
            vCard.style.border = "2px solid #f0f";
        }
        else if (targetBottom > top && targetBottom < bottom && targetRight > left && targetRight < right) {
            vCard.style.border = "2px solid #f0f";
        }
        else if (targetBottom > top && targetBottom < bottom && targetLeft < right && targetLeft > left) {
            vCard.style.border = "2px solid #f0f";
        }
        else {
            vCard.style.border = "2px solid red";
        }
    });
};
