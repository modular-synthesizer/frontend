import { SynthState } from "@/stores/synthesizers/states"

export type DragMoveCallback = (x: number, y: number) => void;

export type DragEndCallback = () => void;

let dragMoveCallback: DragMoveCallback|null = null;

let dragEndCallback: DragEndCallback|null = null;

export function startDragEvent($event: MouseEvent, { end, move }: { end: DragEndCallback | null, move: DragMoveCallback }) {
  useContexts().hide();
  useStates().unblock();
  useStates().setState(SynthState.DRAGGING);
  declareDragMove(move);
  declareDragEnd(end);
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