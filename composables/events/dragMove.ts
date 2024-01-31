export type DragMoveCallback = (x: number, y: number) => void;

export type DragEndCallback = () => void;

let dragMoveCallback: DragMoveCallback|null = null;

let dragEndCallback: DragEndCallback|null = null;

export function declareDragMove(callback: DragMoveCallback) {
  dragMoveCallback = callback;
}

export function declareDragEnd(callback: DragEndCallback) {
  dragEndCallback = callback;
}

export function triggerDragMoves($event: MouseEvent) {
  if (!dragMoveCallback || !$event) return;
  dragMoveCallback($event.clientX, $event.clientY);
}

export async function removeDragMove() {
  dragMoveCallback = null;
  if (dragEndCallback === null) return;
  await dragEndCallback();
  dragEndCallback = null;
}