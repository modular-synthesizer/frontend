import type { Coordinates } from "~/types/utils/Coordinates";
import type { ScalablePosition } from "~~/lib/types/ScalablePosition";
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

function syncPosition(position: Coordinates, { clientX, clientY }: MouseEvent) {
  position.x = clientX;
  position.y = clientY;
}

/**
 * Sets the origin of a drag'n'drop where the user clicks and indicates he's currently dragging it.
 * @param position the position that will be modified during the drag.
 * @param $event the mouse button down event that contains the coordinates where the drag starts.
 */
export function dragStart(position: ScalablePosition, $event: MouseEvent) {
  useStates().setState(SynthState.DRAGGING_VIEW);
  syncPosition(origin, $event);

  startDragEvent($event, {
    move: (x: number, y: number) => {
      position.x += x - origin.x;
      position.y += y - origin.y;
      syncPosition(origin, { clientX: x, clientY: y } as MouseEvent);
    },
  });
}