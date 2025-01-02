export interface DragStrategy {
  start($event: MouseEvent): void;
  move($event: MouseEvent): void;
  get panning(): boolean;
}