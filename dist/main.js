import { Game } from "./classes/Game.js";
import { Pik } from "./classes/Pik.js";
import { Trefl } from "./classes/Trefl.js";
import { Kier } from "./classes/Kier.js";
import { Karo } from "./classes/Karo.js";
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
    // zapisanie tablicy instancji klas tutaj żebym mógł później wywołać position.x|y
    let obecnaKartaInstant = [];
    //stos wszystkich kart w kolumnie
    let allCardsInColumn;
    //stos kart do przeniesienia
    let cardsToMove;
    // id kliknietej karty, tak żebym mógł wziąć poprzednią jeśli istnieje
    let clickedCardId;
    //w taki sposób muszę to robić bo inaczej nie usuną eventu
    const m = (e) => move(e, mouseDownPosition, cardsToMove);
    // **********************************************************************************************************************
    // **********************************************************************************************************************
    card.addEventListener("mousedown", (e) => {
        //wykonuj wszystko jeśli karta ma klasę visible
        if (card.classList.contains("visible")) {
            console.log("mousedown");
            currentCard = cardData;
            console.log(currentCard);
            mouseDownPosition = { top: card.offsetTop - e.clientY, left: card.offsetLeft - e.clientX };
            //stos kart do poruszenia
            const clickPos = { x: e.clientX, y: e.clientY };
            //wychwycenie wszystkich kart w kolumnie
            allCardsInColumn = cards.filter(c => {
                let { right, left, bottom } = c.getBoundingClientRect();
                if (right > clickPos.x && left < clickPos.x && clickPos.y < bottom) {
                    return c;
                }
            });
            clickedCardId = allCardsInColumn.findIndex(c => c == e.currentTarget);
            console.log("clickedCardId", clickedCardId);
            cardsToMove = allCardsInColumn.slice(clickedCardId);
            console.log("cardsToMove::: ", cardsToMove);
            window.addEventListener("mousemove", m);
            card.style.zIndex = "9999";
            //tworze instancej dla kart które są w stosie
            cardsToMove.forEach(c => {
                let currentColor = c.dataset.color;
                const p = { x: c.offsetLeft, y: c.offsetTop };
                //zapisuje obesną pozycje karty w razie jakby musiała wrócić na swoją starą pozycję przy "mouseup"
                // let c;
                switch (currentColor) {
                    case "pik":
                        // obecnaKartaInstant = new Pik(currentCard.color, currentCard.value, true);
                        obecnaKartaInstant.push(new Pik(currentCard.color, currentCard.value, true, p));
                        break;
                    case "trefl":
                        obecnaKartaInstant.push(new Trefl(currentCard.color, currentCard.value, true, p));
                        break;
                    case "kier":
                        obecnaKartaInstant.push(new Kier(currentCard.color, currentCard.value, true, p));
                        break;
                    case "karo":
                        obecnaKartaInstant.push(new Karo(currentCard.color, currentCard.value, true, p));
                        break;
                    default:
                        throw new Error("Something is wrong with yours cards!");
                }
            });
            //stos kart chce wrócić do domu :P
            // cardsToMove.forEach((c, i) => {
            //   //pobieram obecne jej dane
            //   const s = {x: c.offsetLeft, y: c.offsetTop}
            //   console.log("z tablicy?", s)
            //   // obecnaKartaInstant[i].setPosition(s)
            // })
            // console.log("obecnaKartaInstant",obecnaKartaInstant)
            console.log("allCardsInColumn", allCardsInColumn);
        }
    }
    // **********************************************************************************************************************
    // **********************************************************************************************************************
    , 
    // **********************************************************************************************************************
    // **********************************************************************************************************************
    card.addEventListener("mouseup", (e) => {
        if (card.classList.contains("visible")) {
            console.log("mouseup");
            currentCard = null;
            mouseDownPosition = null;
            window.removeEventListener("mousemove", m);
            const visibleCards = Array.from(document.querySelectorAll(".visible"));
            visibleCards.forEach(vCard => {
                if (cardInTarget(vCard.getBoundingClientRect(), card.getBoundingClientRect())) {
                    vCard.style.border = "2px solid #f0f";
                    let color = vCard.dataset.color;
                    let value = vCard.dataset.value;
                    console.log(color, value);
                    let target;
                    switch (color) {
                        case "pik":
                            target = new Pik(color, value, true);
                            break;
                        case "trefl":
                            target = new Trefl(color, value, true);
                            break;
                        case "kier":
                            target = new Kier(color, value, true);
                            break;
                        case "karo":
                            target = new Karo(color, value, true);
                            break;
                        default:
                            throw new Error("Something is wrong with yours cards!");
                    }
                    if (target.takeWhatFits().colors.includes(card.dataset.color) && target.takeWhatFits().value === Number(card.dataset.value)) {
                        console.log("Ale faze, działa XDDDD");
                        obecnaKartaInstant.forEach((c, i) => {
                            const s = { x: vCard.offsetLeft, y: vCard.offsetTop + 100 + 100 * i };
                            c.setPosition(s);
                            // najechałeś i puściłeś - dodaje kalsę do ostatniego elementu odkrytego w stosie - keśli istnieje
                            console.log(allCardsInColumn[clickedCardId]);
                            allCardsInColumn[clickedCardId - 1].classList.remove("invisible");
                            allCardsInColumn[clickedCardId - 1].classList.add("visible");
                        });
                    }
                    else {
                        console.log("nie tym razem synku");
                        // console.log(obecnaKartaInstant)
                        // zmienna globalna tworzona dla trzymanej karty 
                    }
                }
                else {
                    vCard.style.border = "2px solid red";
                    // console.log("y: ", currentCard.position.y, "x: ", currentCard.position.x)
                }
            });
            cardsToMove.forEach((c, i) => {
                c.style.top = obecnaKartaInstant[i].position.y + "px";
                c.style.left = obecnaKartaInstant[i].position.x + "px";
            });
            card.style.zIndex = "22";
            //czyszczę tablicę klas
            obecnaKartaInstant = [];
            allCardsInColumn = [];
        }
    }));
    // card.addEventListener("mouseover", (e: MouseEvent) => {
    //   console.log("MOUSEOVER:: ", cardData)
    // })
});
const move = (e, position, cardsToMove) => {
    // const move = (e) => {
    // let {top: cardTop, right: cardRight, bottom: cardBottom, left: cardLeft} = card.getBoundingClientRect();
    cardsToMove.forEach((card, i) => {
        card.style.top = e.clientY + position.top + i * 100 + "px";
        card.style.left = e.clientX + position.left + "px";
    });
    // card.style.zIndex = "9999";
    // sprawdzam czy nie najechałem przez przypadek na jakoś inną kartę
};
//check if card is in the visible card - target
const cardInTarget = (target, card) => {
    if (card.top < target.bottom && card.top > target.top && card.left < target.right && card.left > target.left) {
        // vCard.style.border ="2px solid #f0f";
        return true;
    }
    else if (card.top < target.bottom && card.top > target.top && card.right > target.left && card.right < target.right) {
        // vCard.style.border ="2px solid #f0f";
        return true;
    }
    else if (card.bottom > target.top && card.bottom < target.bottom && card.right > target.left && card.right < target.right) {
        // vCard.style.border ="2px solid #f0f"; 
        return true;
    }
    else if (card.bottom > target.top && card.bottom < target.bottom && card.left < target.right && card.left > target.left) {
        // vCard.style.border ="2px solid #f0f"; 
        return true;
    }
    else {
        // vCard.style.border ="2px solid red"; 
        return false;
    }
};
// ***************************************************************************************
// ***************************************************************************************
// ***************************************************************************************
// ***************************************************************************************
//KARTA OBECNIE TRZYMANA
// let currentDragedCard;
// const container = document.querySelector("#container") as HTMLDivElement;
// const boxCards = Array.from(
//   document.querySelectorAll(".box-cards")
// ) as HTMLDivElement[];
// const helpersBox = document.querySelector("#helpers") as HTMLDivElement;
// let g = new Game();
// g.startGame();
//TEGO NIE MA 
//pola z kartami od 1 do 7
// boxCards.forEach((box, index) => {
//   //dodaje do pudełek karty
//   g.render(box, index + 1);
//   //drag and dropp settings
//   // box.addEventListener("drop", (e: DragEvent) => {
//   //   e.preventDefault();
//   //   const element = e.target as Element;
//   //   const data = e.dataTransfer?.getData("id") as string;
//   //   //
//   //   // DO POPRAWY - CARTA MA DODATKOWE ELEMENTY
//   //   //
//   //   //jeśli najechałeś na karte to dodaj obecnie trzymaną do parentElement
//   //   let isCard = element.classList.contains("card");
//   //   // if (isCard) {
//   //   //   element.parentElement!.appendChild(document.getElementById(data)!);
//   //   // } else {
//   //   //   element.appendChild(document.getElementById(data)!);
//   //   // }
//   //   // *******************************************************************************************
//   //   console.log("drop!!!!!!!!!!!!!!!!!!!!!!!", e.target);
//   //   const lastElement = box.children[box.children.length - 1];
//   //   const color = lastElement.querySelector("#color-card")!.textContent;
//   //   const value = Number(lastElement.querySelector("#value-card")!.textContent);
//   //   let card;
//   //   switch (color) {
//   //     case "pik":
//   //       card = new Pik(color, value, true);
//   //       break;
//   //     case "trefl":
//   //       card = new Trefl(color, value, true);
//   //       break;
//   //     case "kier":
//   //       card = new Kier(color, value, true);
//   //       break;
//   //     case "karo":
//   //       card = new Karo(color, value, true);
//   //       break;
//   //     default:
//   //       throw new Error("Something is wrong with yours cards!");
//   //   }
//   //   console.log(card, currentDragedCard);
//   //   if(card.takeWhatFits().colors.includes(currentDragedCard.color) && card.takeWhatFits().value == currentDragedCard.value) {
//   //     //dodaje kartę
//   //     //nakładam jedną na drugą
//   //     // console.log("pasuje- bierę")
//   //     box.children[box.children.length - 1].appendChild(document.getElementById(data)!);
//   //   } else {
//   //     console.log("wypchaj się pan z tą kartą")
//   //   }
//   // });
//   // box.addEventListener("dragover", (e: DragEvent) => {
//   //   e.preventDefault();
//   // });
// });
/********************************************* */
//TYM PÓŹNIEJ SIĘ ZAJMIJ
// g.render(helpersBox, 24, false);
/********************************************* */
//to są wszystkie karty
// const cards = Array.from(document.querySelectorAll(".card")) as HTMLDivElement[];
// cards.forEach(card => card.addEventListener("mousedown", () => {
//   console.log("tak działam")
// }))
//widoczne karty mogę przenosić
// const visibleCards = Array.from(
//   document.querySelectorAll(".visible")
// ) as HTMLDivElement[];
// visibleCards.forEach((card) => {
//   //PORUSZANIE KARTĄ
//   // card.addEventListener("mousedown", (e: Event) => {
//   //   let odlegloscOdMyszkiDoGornejKrawendziElementu = e.clientY - card.parentNode.offsetTop - card.offsetTop;
//   //   let odlegloscOdMyszkiDoBocznejKrawendziElementu = e.clientX - card.parentNode.offsetLeft - card.offsetLeft;
//   //   card.addEventListener("mousemove", (e) => {
//   //     let c = card.getBoundingClientRect()
//   //     // let p = card.parentNode.getBoundingClientRect();
//   //     let odlegloscElementuOdRodzica = e.clientY - card.parentNode.offsetTop;
//   //     let odlegloscElementuOdLewejKrawedziRodzica = e.clientX - card.parentNode.offsetLeft;
//   //     // let odlegloscOdMyszkiDoGornejKrawendziElementu = e.clientY - card.parentNode.offsetTop - card.offsetTop;
//   //     console.log("odlegloscElementuOdRodzica::: ", odlegloscElementuOdRodzica)
//   //     console.log("odlegloscOdMyszkiDoGornejKrawendziElementu::: ", odlegloscOdMyszkiDoGornejKrawendziElementu)
//   //     console.log(e.clientY, card.offsetTop, card.parentNode.offsetTop);
//   //     card.style.top =  odlegloscElementuOdRodzica - odlegloscOdMyszkiDoGornejKrawendziElementu + "px";
//   //     card.style.left = odlegloscElementuOdLewejKrawedziRodzica - odlegloscOdMyszkiDoBocznejKrawendziElementu + "px";
//   //     // e.target.style.border = '2px solid green';
//   //     // e.target.style.zIndex = 9999;
//   //     // e.target.style.background = "green";
//   //     // e.target.style.left = c.left + e.clientX + "px";
//   //   })
//   // })
//   // card.addEventListener("mousedown", () => {
//   // console.log("tak działam")
//   // })
//   // card.addEventListener("click", (e: Event) => {
//   //   let color = e.target.children[0].innerText;
//   //   let value = e.target.children[1].innerText;
//   //   let x = new Pik(color, value, true);
//   //   console.log(x.takeWhatFits());
//   // });
//   // card.addEventListener("dragstart", (e: DragEvent) => {
//   //   const element = e.target as Element;
//   //   e.dataTransfer?.setData("id", element.id);
//   //   requestAnimationFrame(function () {
//   //     element.classList.add("hide");
//   //   });
//   //   const color = e.target.querySelector("#color-card")!.textContent;
//   //   const value = Number(e.target.querySelector("#value-card")!.textContent);
//   //   switch (color) {
//   //     case "pik":
//   //       currentDragedCard = new Pik(color, value, true);
//   //       break;
//   //     case "trefl":
//   //       currentDragedCard = new Trefl(color, value, true);
//   //       break;
//   //     case "kier":
//   //       currentDragedCard = new Kier(color, value, true);
//   //       break;
//   //     case "karo":
//   //       currentDragedCard = new Karo(color, value, true);
//   //       break;
//   //     default:
//   //       throw new Error("Something is wrong with yours cards!");
//   //   }
//   //   console.log(currentDragedCard);
//   // });
//   // card.addEventListener("dragend", (e: DragEvent) => {
//   //   e.preventDefault();
//   //   const element = e.target as Element;
//   //   // *******************************************************************************************
//   //   console.log("dragend::  udało sie przenieść?");
//   //   currentDragedCard = null;
//   //   element.classList.remove("hide");
//   // });
// });
