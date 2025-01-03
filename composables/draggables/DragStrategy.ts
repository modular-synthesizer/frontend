export interface DragStrategy {
  start($event: MouseEvent): void;
  move($event: MouseEvent): void;
  end(): void;
  get panning(): boolean;
}