export class Game {
    constructor() {
        //tutaj będą trafiały losowane karty
        // readonly cards: ICard[] = [];
        this.cards = [];
        //początkowe rozłożenie kart w odpowienich miejscach
        //renderuje kilka kart w jednym miejscu a nie po jednej karcie
        // render(
        //   elem: HTMLDivElement,
        //   num: number,
        //   visibilityLastElem: boolean = true
        // ) {
        //   let cardsForThisBox = this.cards.splice(0, num);
        //   let box = new DocumentFragment();
        //   //helpers też z tego korzysta i nie chce mieć widoczengo ostatniego elementu
        //   if (visibilityLastElem) {
        //     cardsForThisBox[cardsForThisBox.length - 1].visible = true;
        //   }
        //   cardsForThisBox.forEach((element, id) => {
        //     let card = document.createElement("div");
        //     let color = document.createElement("p");
        //     let value = document.createElement("p");
        //     card.classList.add("card", "invisible");
        //     card.setAttribute("id", `${element.color}-${element.value}`)
        //     color.setAttribute("id", "color-card");
        //     value.setAttribute("id", "value-card");
        //     color.innerText = element.color;
        //     value.innerText = element.value.toString();
        //     card.style.top = `${id *  100}px`
        //     if (element.visible === true) {
        //       card.classList.remove("invisible");
        //       card.classList.add("visible");
        //       // card.setAttribute("draggable", "true");
        //     }
        //     card.append(color);
        //     card.append(value);
        //     box.append(card);
        //   });
        //   elem.append(box);
        // }
    }
    // constructor(private container: HTMLDivElement) {}
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
            return {
                color: k,
                value: v[0],
                visible: false,
            };
        });
    }
    startGame() {
        //losuje karty
        this.cards = this.randomCards();
        console.dir(this.cards);
        //dodaje karty do body
        // w pozycji :
        // ***
        //  **
        //   *
        const container = document.querySelector("#container");
        const cards = new DocumentFragment();
        let column = 7;
        let last = 0;
        let iterator = 0;
        this.cards.forEach((card, id) => {
            let cardDiv = document.createElement("div");
            let color = document.createElement("p");
            let value = document.createElement("p");
            cardDiv.classList.add("card");
            // cardDiv.classList.add("card", "invisible");
            cardDiv.setAttribute("id", `card-${id}`);
            // color.setAttribute("id", "color-card");
            // value.setAttribute("id", "value-card");
            cardDiv.dataset.color = card.color;
            cardDiv.dataset.value = card.value.toString();
            color.innerText = card.color;
            value.innerText = card.value.toString();
            let top;
            let left;
            if (id < 28) {
                top = iterator * 100;
                left = ((id - last) % column) * 100 + top;
                cardDiv.style.top = `${100 + top}px`;
                cardDiv.style.left = `${100 + left}px`;
                //zmiana visible dla konkretnych kart, które są ostatnimi w swoim stosie
                if (id == last) {
                    // console.log(id)
                    card.visible = true;
                    cardDiv.classList.add("visible");
                }
                else {
                    cardDiv.classList.add("invisible");
                }
                if ((id - last) % column === column - 1 && column > 1) {
                    last = id + 1;
                    column--;
                    iterator++;
                }
            }
            // if (card.visible === true) {
            //   // cardDiv.classList.remove("invisible");
            //   cardDiv.classList.add("visible");
            //   // card.setAttribute("draggable", "true");
            // }
            cardDiv.append(color);
            cardDiv.append(value);
            cards.append(cardDiv);
        });
        container.append(cards);
        // for(let i = 0; i < 7; i++) {
        //   for(let j = 0; j < 7; j++) {
        //   }
        // }
    }
}
