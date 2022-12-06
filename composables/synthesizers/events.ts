import ICoordinates from "~~/lib/interfaces/ICoordinates";
import { useLinkDrag } from "~~/stores/links/linksDrag";
import { useParameters } from "~~/lib/stores/tools/parameters";
import { useZoomStore } from "~~/stores/synthesizers/zoom";

export function dragmove($event: MouseEvent) {
  const {x, y}: ICoordinates = {x: $event.clientX, y: $event.clientY}
  useSynthesizerDrag().dragmove(x, y);
  useModDrag().dragmove(x, y);
  useLinkDrag().dragmove(x, y);
  useParameters().moveParameterSetting(x, y);
}

export function dragend() {
  useSynthesizerDrag().dragend();
  useModDrag().dragend()
  useLinkDrag().dragend()
  useParameters().endParameterSetting()
}

export function wheel($event: WheelEvent) {
  useZoomStore().setScale($event.deltaY);
}

export function dragstart($event: MouseEvent) {
  useSynthesizerDrag().dragstart($event.clientX, $event.clientY);
}