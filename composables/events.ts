import { Coordinates } from "~~/lib/types/Coordinates";
import { ScalablePosition } from "~~/lib/types/ScalablePosition";
import { MAX_ZOOM_IN, MAX_ZOOM_OUT, ZOOM_RATIO } from "~~/lib/utils/constants";

/**
 * Sets the scale of a given object by determining it from a given wheel event. The dela Y of the wheel event is used
 * to compute the new value of the scale from a constant-stored zoom ratio.
 * 
 * @param position The object containing a :scale field to set the value of.
 * @param $event A wheel event (wheel up or wheel down) sent by the UI.
 */
export function setScale(position: ScalablePosition, $event: WheelEvent) {
  useStates().setState(SynthState.ZOOMING);
  const delta = $event.deltaY;

  let scale: number = Math.abs(position.scale + delta * -ZOOM_RATIO);
  position.scale = Math.min(Math.max(MAX_ZOOM_OUT, scale), MAX_ZOOM_IN);

  useStates().unblock();
}

export const origin: Coordinates = { x: 0, y: 0 }

/**
 * Sets the origin of a drag'n'drop where the user clicks and indicates he's currently dragging it.
 * @param $event the mouse button down event that contains the coordinates where the drag starts.
 */
export function dragStart($event: MouseEvent) {
  useStates().setState(SynthState.DRAGGING_VIEW);
  origin.x = $event.clientX;
  origin.y = $event.clientY;
}

export function dragMove(position: ScalablePosition, $event: MouseEvent) {
  if (!useStates().is(SynthState.DRAGGING_VIEW)) return;
  position.x += $event.clientX - origin.x;
  position.y += $event.clientY - origin.y;
  origin.x = $event.clientX;
  origin.y = $event.clientY;
}

export function dragEnd() {
  useStates().unblock();
  useStates().setState(SynthState.NONE);
}