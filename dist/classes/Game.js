import { Pik } from "./Pik.js";
import { Karo } from "./Karo.js";
import { Kier } from "./Kier.js";
import { Trefl } from "./Trefl.js";
export class Game {
    constructor(container) {
        this.container = container;
        //tutaj będą trafiały losowane karty
        this.cards = [];
    }
    getArray() {
        return [...Array(13).keys()];
    }
    radnomMinMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    randomCards() {
        let color = ["pik", "trefl", "karo", "kier"];
        let cards = {
            pik: this.getArray(),
            trefl: this.getArray(),
            karo: this.getArray(),
            kier: this.getArray(),
        };
        return Array(52)
            .fill(null)
            .map((i) => {
            let idK = this.radnomMinMax(0, color.length - 1); //id koloru - potrzebne do usunięcia
            let k = color[idK]; //kolor karty
            let id = this.radnomMinMax(0, cards[k].length - 1); //index wartosci karty
            let v = cards[k].splice(id, 1); //wartość karty plus wycinam element z tablicy
            //sprawdzma czy tablica nie jest pusta
            if (cards[k].length === 0) {
                color.splice(idK, 1);
            }
            //tutaj daj switcha z new Karta !!!
            switch (k) {
                case "pik":
                    return new Pik(k, v[0], false);
                // return {}
                case "karo":
                    return new Karo(k, v[0], false);
                case "kier":
                    return new Kier(k, v[0], false);
                case "trefl":
                    return new Trefl(k, v[0], false);
                default:
                    throw new Error("Something went wrong when I picked the cards for you!");
            }
        });
    }
    startGame() {
        //losuje karty
        //zwracam tablicę kart?
        this.cards = this.randomCards();
        // cards.forEach(element => {
        //   let card = document.createElement("div");
        //   card.innerText = element.color + " " + element.value;
        //   card.classList.add("card");
        //   this.container.append(card);
        // })
    }
    //początkowe rozłożenie kart w odpowienich miejscach
    render(elem, num, visibilityLastElem = true) {
        let cardsForThisBox = this.cards.splice(0, num);
        let box = new DocumentFragment();
        //helpers też z tego korzysta i nie chce mieć widoczengo ostatniego elementu
        if (visibilityLastElem) {
            cardsForThisBox[cardsForThisBox.length - 1].setVisibleToTrue();
        }
        cardsForThisBox.forEach((element, id) => {
            let card = document.createElement("div");
            card.innerText = element.color + " " + element.value;
            card.classList.add("card", "invisible");
            card.setAttribute("id", `${element.color}-${element.value}`);
            if (element.visible === true) {
                card.classList.remove("invisible");
                card.classList.add("visible");
                card.setAttribute("draggable", "true");
            }
            box.append(card);
        });
        elem.append(box);
    }
}
