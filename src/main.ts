
// class A {
//   // public isVisible: true;
//   constructor(public isVisible: boolean){}

//   setVisibleToTrue() {
//     this.isVisible = true;
//   }
// }

// class B extends A {
//   // public color: "red";
//   constructor(public color: string, isVisible: boolean){
//     super(isVisible);
//   }
// }

// let pik10 = new B("pik", false)
// console.log(pik10)
// pik10.setVisibleToTrue();
// console.log(pik10)


class Game {
  private 

  private getArray() {
    return [...Array(13).keys()];
  }

  private losuj(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public mojeKarty() {
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
        let idK = this.losuj(0, color.length - 1); //id koloru - potrzebne do usunięcia
        let k = color[idK]; //kolor karty

        // if(this.carta[k].length === 0) {
        //   this.kolor.splice(idK, 1);
        //   console.log(this.kolor)
        //   idK = this.losuj(0, this.kolor.length - 1); //id koloru - potrzebne do usunięcia
        //   k = this.kolor[idK]; //kolor karty
        // }

        let id = this.losuj(0, cards[k].length - 1); //index wartosci karty

        let v = cards[k].splice(id, 1); //wartość karty plus wycinam element z tablicy

        //sprawdzma czy tablica nie jest pusta
        if (cards[k].length === 0) {
          color.splice(idK, 1);
        }

        console.log(k, v[0]);

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
            throw new Error(
              "Something went wrong when I picked the cards for you!"
            );
        }
      });
  }
}


let g = new Game();
let a = g.mojeKarty();
console.log(g.losuj(0, 0));
console.log(a)
let pik = a.filter((i) => i.color === "pik").length;
let trefl = a.filter((i) => i.color === "trefl").length;
let karo = a.filter((i) => i.color === "karo").length;
let kier = a.filter((i) => i.color === "kier").length;
// console.log(a);
console.log("pik", pik, "trefl", trefl, "karo", karo, "kier", kier);
