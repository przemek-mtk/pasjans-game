import { Game } from "./classes/Game.js";
const container = document.querySelector("#container");
const boxCards = Array.from(document.querySelectorAll(".box-cards"));
const helpersBox = document.querySelector("#helpers");
let g = new Game(container);
g.startGame();
//dodaje do pudełek karty
boxCards.forEach((box, index) => {
    g.render(box, index + 1);
    //drag and dropp settings
    box.addEventListener("drop", (e) => {
        var _a;
        e.preventDefault();
        const element = e.target;
        const data = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("id");
        //jeśli najechałeś na karte to dodaj obecnie trzymaną do parentElement
        let isCard = element.classList.contains("card");
        if (isCard) {
            element.parentElement.appendChild(document.getElementById(data));
        }
        else {
            element.appendChild(document.getElementById(data));
        }
    });
    box.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
});
g.render(helpersBox, 24, false);
//to są wszystkie karty
// const cards = Array.from(document.querySelectorAll(".card")) as HTMLDivElement[];
// cards.forEach(card => card.addEventListener("mousedown", () => {
//   console.log("tak działam")
// }))
//widoczne karty mogę przenosić
const visibleCards = Array.from(document.querySelectorAll(".visible"));
visibleCards.forEach((card) => {
    // card.addEventListener("mousedown", () => {
    // console.log("tak działam")
    // })
    card.addEventListener("dragstart", (e) => {
        var _a;
        const element = e.target;
        (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("id", element.id);
        requestAnimationFrame(function () {
            element.classList.add("hide");
        });
    });
    card.addEventListener("dragend", (e) => {
        e.preventDefault();
        const element = e.target;
        element.classList.remove("hide");
    });
});
