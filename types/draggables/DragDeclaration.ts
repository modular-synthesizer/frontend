import type { IStrategy } from "~/utils/draggables/IStrategy";

export type DragDeclaration = (strategy: IStrategy, $event: MouseEvent) => void;