export interface ICard {
  move(e: Event, position: {x: number, y: number}, index: number): void;
}
