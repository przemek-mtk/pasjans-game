import { Game } from "./classes/Game.js";

const container = document.querySelector("#container") as HTMLDivElement;
const boxCards = Array.from(
  document.querySelectorAll(".box-cards")
) as HTMLDivElement[];
const helpersBox = document.querySelector("#helpers") as HTMLDivElement;

let g = new Game(container);
g.startGame();

//dodaje do pudełek karty
boxCards.forEach((box, index) => {
  g.render(box, index + 1);

  //drag and dropp settings
  box.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    const element = e.target as Element;
    const data = e.dataTransfer?.getData("id") as string;

    //jeśli najechałeś na karte to dodaj obecnie trzymaną do parentElement
    let isCard = element.classList.contains("card");


    if (isCard) {
      element.parentElement!.appendChild(document.getElementById(data)!);
    } else {
      element.appendChild(document.getElementById(data)!);
    }
  });
  box.addEventListener("dragover", (e: DragEvent) => {
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
const visibleCards = Array.from(
  document.querySelectorAll(".visible")
) as HTMLDivElement[];

visibleCards.forEach((card) => {
  // card.addEventListener("mousedown", () => {
  // console.log("tak działam")
  // })

  card.addEventListener("dragstart", (e: DragEvent) => {
    const element = e.target as Element;
    e.dataTransfer?.setData("id", element.id);

    requestAnimationFrame(function () {
      element.classList.add("hide");
    });
  });

  card.addEventListener("dragend", (e: DragEvent) => {
    e.preventDefault();
    const element = e.target as Element;
    element.classList.remove("hide");
  });
});
