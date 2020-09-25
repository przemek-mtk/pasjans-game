import { Game } from "./classes/Game.js";
import { Card } from "./classes/Card.js";
var Column;
(function (Column) {
    Column[Column["One"] = 0] = "One";
    Column[Column["Two"] = 1] = "Two";
    Column[Column["Three"] = 2] = "Three";
    Column[Column["Four"] = 3] = "Four";
    Column[Column["Five"] = 4] = "Five";
    Column[Column["Six"] = 5] = "Six";
    Column[Column["Seven"] = 6] = "Seven";
    Column[Column["ForSelection"] = 11] = "ForSelection";
    Column[Column["ForSelectionNext"] = 12] = "ForSelectionNext";
})(Column || (Column = {}));
let g = new Game();
g.startGame();
// console.log("one:::: ", g.column[].getCards())
// console.log("two:::: ", g.column.two.getCards())kt
// console.log("three:::: ", g.column.three.getCards())
// console.log("four:::: ", g.column.four.getCards())
// console.log("five:::: ", g.column.five.getCards())
// console.log("six:::: ", g.column.six.getCards())
// console.log("seven:::: ", g.column.seven.getCards())
// console.log("one:::: ", g.columns[Column.One].getCards());
// console.log("two:::: ", g.columns[Column.Two].getCards());
// console.log("three:::: ", g.columns[Column.Three].getCards());
// console.log("four:::: ", g.columns[Column.Four].getCards());
// console.log("five:::: ", g.columns[Column.Five].getCards());
// console.log("six:::: ", g.columns[Column.Six].getCards());
// console.log("seven:::: ", g.columns[Column.Seven].getCards());
const cards = Array.from(document.querySelectorAll(".card"));
const forSelection = Array.from(document.querySelectorAll(".for-selection"));
const repeat = document.querySelector(".repeat");
let x = g.columns; //.slice(0, 11);
console.log(":::::::::::::::::::::::::::", x);
cards.forEach((element) => {
    // pozycja kursora w momencie mousedown
    let clickedPosition = {
        x: 0,
        y: 0,
    };
    // dane karty
    const cardData = {
        color: element.dataset.color,
        value: parseFloat(element.dataset.value),
    };
    // callback function dla window "mousemove"
    let cb;
    // kolumna z której przenosze karty
    let clickedColumn;
    // id karty którą przenoszę - potrzebne do ustawienia class visible dla elementu wyżej
    let clickedCardId;
    // karty które prznoszę - element Dom[]
    // let belowClickedCard;
    // karty które przenoszę - Card[]
    let instantCards;
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    element.addEventListener("mousedown", (e) => {
        if (e.currentTarget.classList.contains("moved")) {
            console.log("mousedown");
            // zapisanie pozycji kursora na karcie
            clickedPosition.x = element.offsetLeft - e.clientX;
            clickedPosition.y = element.offsetTop - e.clientY;
            // kolumna w która klikam
            clickedColumn = g.getColumn(cardData);
            clickedCardId = clickedColumn.getCardId(cardData);
            let belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
            //ustawiam obecną pozycję kart jako początkową podczas przenoszenia
            instantCards = belowClickedCard.map((c) => new Card(c).setPosition({ x: c.offsetLeft, y: c.offsetTop }));
            // calback fn in window "move" event
            cb = (e) => instantCards.map((c, i) => c.move(e, clickedPosition, i));
            window.addEventListener("mousemove", cb);
            console.log("clickedCardId", clickedCardId);
            console.log("clickedColumn", clickedColumn);
        }
    });
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    // ************************************************************************************************************************************************************************************
    element.addEventListener("mouseup", (e) => {
        if (e.currentTarget.classList.contains("moved") && clickedCardId !== undefined) {
            console.log("mouseup");
            window.removeEventListener("mousemove", cb);
            // pobieram ostatnie karty z kolumn
            // nie potrzebuje ostatnich dwóch kolumn -  nie chce dodawać tam kart
            let x = g.columns.slice(0, 11);
            // console.log(":::::::::::::::::::::::::::", x)
            let targetCards = x.map(column => column.getLastCard());
            // console.log("targetCards",targetCards);
            // sprawdzam do której karty pasuje przenoszona karta - zwraca element DOM lub undefined
            let cardAndColumnWhoWantsThisOtherCards = targetCards
                // .find((tCard, i) => new Card(tCard).checkIfFits(element, g.columns[i]));
                .reduce((acc, tCard, i) => {
                let x = new Card(tCard).checkIfFits(element, g.columns[i]);
                // console.log(x)
                if (x !== undefined) {
                    return {
                        element: tCard,
                        columnNum: i
                    };
                }
                return acc;
            }, {});
            console.log("cardAndColumnWhoWantsThisOtherCards", cardAndColumnWhoWantsThisOtherCards);
            // sprawdzam czy któraś kolumna chce ta kartę
            // x - kolumny od 0-6
            // let nwm = x.find(col => col.nextCard.colors.includes(cardData.color) && col.nextCard.value === cardData.value);
            // nmw = columna na której puszczono kartę i ta kolumna jest w sanie ją przyjąć
            // console.log("nie wiem jak to opisć=======", nwm);
            // nwm?.addCard()
            /*
                  // elementy które przyjmują karty od asa w górę
                  let z = g.aboveAs.map(column => column.getLastCard());
                  let boxWhoWantsAsUp = z.find(tCard => new Card(tCard).checkIfFits(element) === true);
                  console.log("boxWhoWantsAsUp", boxWhoWantsAsUp);
            
                  if(boxWhoWantsAsUp) {
                    let newPosition: {x: number, y: number} = {x: boxWhoWantsAsUp.offsetLeft, y: boxWhoWantsAsUp.offsetTop};
                    if(instantCards.length === 1) {
                      instantCards.forEach((c, i) => c.setPosition({x: newPosition.x, y: newPosition.y}));
                    }
            
                    let q = g.getColumn({color: boxWhoWantsAsUp.dataset.color, value: parseFloat(boxWhoWantsAsUp.dataset.value)}, "up")
                    console.log("qq:::::::::::::", q);
            
                    q.addCard(clickedColumn.getCardsBelow(clickedCardId));
                    // usuwam przeniesione karty ze starej kolumny
                    clickedColumn.removeCards(clickedCardId);
                    // usuwam klasę(CSS) invisible i dodaję visible do ostatniego elementu DOM w columnie z której prznieniosłem karty
                    if(clickedColumn.getLastCard()) { // dopóki zwraca element
                      clickedColumn.getLastCard()!.classList.remove("invisible");
                      clickedColumn.getLastCard()!.classList.add("visible");
                      clickedColumn.getLastCard()!.classList.add("moved");
                    }
                    // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty
                    //to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
                    if(clickedColumn === g.columns[Column.ForSelectionNext]) {
                      clickedColumn.moveCards();
                    }
            
                  }
            */
            let belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
            //te karty chce przenieść
            // let clickedColumn = g.getColumn(cardData);
            // console.log("clickedColumn", clickedColumn);
            // let clickedCardId = clickedColumn.getCardId(cardData);
            // console.log("clickedCardId", clickedCardId);
            // let belowClickedCard = clickedColumn.getCardsBelow(clickedCardId);
            // console.log("belowClickedCard", belowClickedCard);
            //pobieram kolumnę nad którą puszczasz kartę
            let columnWitchGetCards;
            if (cardAndColumnWhoWantsThisOtherCards.element) {
                // zmieniam kolumnę która ma te karty
                // columnWitchGetCards = g.getColumn({color: cardAndColumnWhoWantsThisOtherCards.dataset.color, value: parseFloat(cardAndColumnWhoWantsThisOtherCards.dataset.value)})
                columnWitchGetCards = g.columns[cardAndColumnWhoWantsThisOtherCards.columnNum];
                console.log("columnWitchGetCards", columnWitchGetCards);
                // nowa pozycja dla kart
                let newPosition;
                if (cardAndColumnWhoWantsThisOtherCards.element.classList.contains("special")) { //ostatnie elementy w kolumnie -  boxy do których rozdaje karty
                    newPosition = { x: cardAndColumnWhoWantsThisOtherCards.element.offsetLeft + 5, y: cardAndColumnWhoWantsThisOtherCards.element.offsetTop - 95 };
                }
                else if (cardAndColumnWhoWantsThisOtherCards.columnNum > 6 && cardAndColumnWhoWantsThisOtherCards.columnNum < 11) {
                    console.log("TUTAJ KURWA:", columnWitchGetCards.getCardsBelow(0)[0].offsetLeft, columnWitchGetCards.getCardsBelow(0)[0].offsetTop);
                    newPosition = { x: columnWitchGetCards.getCardsBelow(0)[0].offsetLeft + 5, y: columnWitchGetCards.getCardsBelow(0)[0].offsetTop - 95 };
                }
                else { //zwykła karta na która pasuje puszczna karta
                    newPosition = { x: cardAndColumnWhoWantsThisOtherCards.element.offsetLeft, y: cardAndColumnWhoWantsThisOtherCards.element.offsetTop };
                }
                // console.log("instantCards", instantCards)
                // instantCards.forEach(c => c.moveTo());
                // instantCards.forEach((c, i) => c.setPosition({ x: s.x, y: s.y + i * 100})); 
                instantCards.forEach((c, i) => c.setPosition({ x: newPosition.x, y: newPosition.y + i * 100 + 100 }));
                // belowClickedCard.forEach((e,i) => {
                //   e.style.top = s.y + i * 100 + 100  + "px";
                //   e.style.left = s.x + "px";
                // })
                // } else {
                //   // niestety chłopaki wracacie do domu
                //   // belowClickedCard.forEach((e,i) => {
                //   //   e.style.top = s.y + i * 100 + 100  + "px";
                //   //   e.style.left = s.x + "px";
                //   // })
                // dodaje przenoszona karty do kolumny nad którą upuściłem
                columnWitchGetCards.addCard(belowClickedCard);
                // usuwam przeniesione karty ze starej kolumny
                clickedColumn.removeCards(clickedCardId);
                // usuwam klasę(CSS) invisible i dodaję visible do ostatniego elementu DOM w columnie z której prznieniosłem karty
                if (clickedColumn.getLastCard()) { // dopóki zwraca element
                    clickedColumn.getLastCard().classList.remove("invisible");
                    clickedColumn.getLastCard().classList.add("visible");
                    clickedColumn.getLastCard().classList.add("moved");
                }
                // jeśli kliknieta kolumna jest tą która trzyma odsłoniete karty
                //to cofnij jej ostatnie 3 karty w lewo stronę (style.left) o jedną zabraną kartę
                if (clickedColumn === g.columns[Column.ForSelectionNext]) {
                    clickedColumn.moveCards();
                }
            }
            // console.log("instantCards", instantCards)
            // prznieś karty do nowej pozycji - lub cofnij do starej pozycji  
            instantCards.forEach(c => c.moveTo());
            // console.log(g.columns)
            // let s = g.getColumn({color: "kier", value: 12})
            // console.log(s);
            // let column = g.getColumn(cardData)
            // let mouseupInCard = column.getLastCard()
            // console.log("mouseupInCard", mouseupInCard)
        }
    });
});
// ************************************************************************************************************************************************************************************
// ************************************************************************************************************************************************************************************
// ************************************************************************************************************************************************************************************
forSelection.forEach(element => {
    element.addEventListener("click", (e) => {
        if (element.classList.contains("invisible")) {
            const lastCard = g.columns[Column.ForSelection].getLastCard();
            lastCard === null || lastCard === void 0 ? void 0 : lastCard.classList.remove("invisible");
            lastCard === null || lastCard === void 0 ? void 0 : lastCard.classList.add("visible");
            // usuwam z forSelection ostatnią kartę -  to ta kliknięta
            g.columns[Column.ForSelection].removeCards(g.columns[Column.ForSelection].getCardsBelow(0).length - 1);
            // i dodaję ją do kolumny obok
            g.columns[Column.ForSelectionNext].addCard([lastCard]);
            // ruszam ostatnie 3 karty jakie trafiły do kolumny 12 (Column.ForSelectionNext)
            g.columns[Column.ForSelectionNext].moveCards();
            console.log("Column.ForSelection::: ", g.columns[Column.ForSelection].getCardsBelow(0));
            console.log("Column.ForSelectionNext::: ", g.columns[Column.ForSelectionNext].getCardsBelow(0));
        }
    });
});
//cofanie kart z powrotem do kolumny forSelection + cofanie style.left = 0px
repeat.addEventListener("click", (e) => {
    const cards = g.columns[Column.ForSelectionNext].getCardsBelow(0).reverse();
    cards.forEach(c => {
        c.classList.add("invisible");
        c.classList.remove("visible");
        c.style.left = "0px";
    });
    console.log("cards", cards);
    g.columns[Column.ForSelectionNext].removeCards(0);
    g.columns[Column.ForSelection].addCard(cards);
});
