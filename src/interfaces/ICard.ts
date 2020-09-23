export interface ICard {
  move(e: Event, position: {x: number, y: number}, index: number): void;
  moveTo(): void;
  // to zwraca samo siebie -- ??????
  // jak to poprawić?!?!?!
  setPosition(position: {x: number, y: number}): any; 
  checkIfFits(elem: HTMLDivElement): boolean;
}
