export interface IMovements {
  resetState(): void;
  incrementState(): void;
  decrementState(): void;
  getMovements(): number;
}
