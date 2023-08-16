import ICoordinates from "~~/lib/interfaces/ICoordinates";

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
  useParameters().endParameterSetting();
  useModHover().update();
}

export function wheel($event: WheelEvent) {
  useZoomStore().setScale($event.deltaY);
}

export function dragstart($event: MouseEvent) {
  useSynthesizerDrag().dragstart($event.clientX, $event.clientY);
}