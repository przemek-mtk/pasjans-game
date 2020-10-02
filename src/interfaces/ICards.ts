export interface ICards {
  element: HTMLDivElement;
  color: string;
  value: number;
  columnId: number;
  idInColumn: number;
  isVisible: boolean;
  isMoved: boolean;
  // isLast: null,
  position: { x: 0; y: 0 };
}
