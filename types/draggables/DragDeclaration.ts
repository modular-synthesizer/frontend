import type { Draggable } from "../utils/Coordinates";

export type DragDeclaration = (target: Draggable, sx: number, sy: number, $event: MouseEvent) => void;