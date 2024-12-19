import { RACK_HEIGHT, SLOT_SIZE } from "~/lib/utils/constants";
import type { Port } from '~/types/modules/Port';
import type { Control } from "~/types/tools/Control";
import type { ToolPort } from "~/types/tools/Port";
import type { Coordinates } from "~/types/utils/Coordinates";

export function isInput(port: ToolPort|Port) {
  return port.kind === 'input';
}

export function getControl({ mod, name }: Port): Control {
  return mod.controls.find(c => c.payload.target === name && c.component === 'Port') as Control;
}

export function getAbsoluteCoordinates(port: Port): Coordinates {
  return {
    x: +getControl(port).payload.x + port.mod.slot * SLOT_SIZE,
    y: +getControl(port).payload.y + port.mod.rack * RACK_HEIGHT,
  }
}