import { useZoomStore } from "~~/stores/synthesizers/zoom";

export function dragmove($event: MouseEvent) {
  useSynthesizerDrag().dragmove($event.clientX, $event.clientY);
}

export function dragend() {
  useSynthesizerDrag().dragend();
}

export function wheel($event: WheelEvent) {
  useZoomStore().setScale($event.deltaY);
}

export function moduleDragstart($event: MouseEvent) {
  useSynthesizerDrag().dragstart($event.clientX, $event.clientY);
}