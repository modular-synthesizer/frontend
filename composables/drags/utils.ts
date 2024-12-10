// This composable holds the logic to generally declare drag'n'drop events handlers. It provides utility functions
// to tell the application what should be done when moving during or cancelling/finishing a drag.

export type DragMoveCallback = (x: number, y: number) => void;

export type DragEndCallback = () => void;

let dragMoveCallback: DragMoveCallback|null = null;

let dragEndCallback: DragEndCallback|null = null;

/**
 * Declares callbacks to call at different points during the current drag.
 * @param $event the mouse event triggering the drag (mouse button down).
 * @param callbacks the callbacks to call when moving with the mouse click pressed, or when ending the drag. 
 */
export function startDragEvent($event: MouseEvent, { end, move }: { end?: DragEndCallback, move: DragMoveCallback }) {
  useContexts().hide();
  useStates().unblock();
  useStates().setState(SynthState.DRAGGING);
  declareDragMove(move);
  if (end !== undefined) declareDragEnd(end);
  triggerDragMove($event);
}

export function declareDragMove(callback: DragMoveCallback) {
  dragMoveCallback = callback;
}

export function declareDragEnd(callback: DragEndCallback) {
  dragEndCallback = callback;
}

export function triggerDragMove($event: MouseEvent) {
  if (!useStates().is(SynthState.DRAGGING)) return;
  if (!dragMoveCallback || !$event) return;
  dragMoveCallback($event.clientX, $event.clientY);
}

export function triggerDragEnd($event: MouseEvent) {
  useStates().unblock();
  useStates().setState(SynthState.NONE);
  removeEvents();
}

export async function removeEvents() {
  dragMoveCallback = null;
  if (!!dragEndCallback) await dragEndCallback();
  dragEndCallback = null;
}