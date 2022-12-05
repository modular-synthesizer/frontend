import ICoordinates from "~~/lib/interfaces/ICoordinates";
import { useLinkDrag } from "~~/lib/stores/links/dragAndDrop";
import { useModDrag } from "~~/lib/stores/mods/dragAndDrop";
import { useParameters } from "~~/lib/stores/tools/parameters";
import { useZoomStore } from "~~/stores/synthesizers/zoom";

export function dragmove($event: MouseEvent) {
  const {x, y}: ICoordinates = {x: $event.clientX, y: $event.clientY}
  useSynthesizerDrag().dragmove(x, y);
  useModDrag().moveModDrag(x, y);
  useLinkDrag().moveLink(x, y);
  useParameters().moveParameterSetting(x, y);
}

export function dragend() {
  useSynthesizerDrag().dragend();
  useModDrag().endModDrag()
  useParameters().endParameterSetting()
}

export function wheel($event: WheelEvent) {
  useZoomStore().setScale($event.deltaY);
}

export function moduleDragstart($event: MouseEvent) {
  useSynthesizerDrag().dragstart($event.clientX, $event.clientY);
}