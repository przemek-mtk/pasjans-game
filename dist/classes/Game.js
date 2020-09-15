import { Pik } from "./Pik.js";
import { Karo } from "./Karo.js";
import { Kier } from "./Kier.js";
import { Trefl } from "./Trefl.js";
export class Game {
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
                    return new Pik(k, v[0]);
                case "karo":
                    return new Karo(k, v[0]);
                case "kier":
                    return new Kier(k, v[0]);
                case "trefl":
                    return new Trefl(k, v[0]);
                default:
                    throw new Error("Something went wrong when I picked the cards for you!");
            }
        });
    }
}
