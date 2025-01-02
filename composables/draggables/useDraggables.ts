import Stage from "~/components/draggable/Stage.vue"
import type { Coordinates } from "~/types/utils/Coordinates"
import type { DragStrategy } from "./DragStrategy"
import { ItemDragStrategy } from "./ItemDragStrategy"
import { StagePanStrategy } from "./StagePanStrategy"

export type Stage = {
  name: string,
  // The offset coordinates of the stage INSIDE (how is it moved from its 0;0 point).
  d: Coordinates,
  // The offset coordinates of the stage OUTSIDE (where is it on the screen currently).
  a: Coordinates,
  scale: number
  draggables: Array<Draggable>,
  strategy?: DragStrategy,
}

type DraggableOptions = {
  sx: number,
  sy: number,
}

export type Draggable = {
  name: string,
  item: Coordinates,
  options: DraggableOptions,
  stage: Stage,
}

type State = {
  stages: Array<Stage>,
}

const state: Ref<State> = ref({ stages: [] });

/**
 * 
 * @param name Declares a new stage where elements can be dragged and dropped by the user.
 * @param dx the current offset of the stage on the X axis.
 * @param dy the current offset of the stage on the Y axis.
 * @param scale the current level of zoom of the stage, used to infer coordinates.
 * @param options Some configuration options, like the number of pixels of a drag step, etc.
 */
function declare(name: string, d: Coordinates = { x: 0, y: 0 }, a: Coordinates = { x: 0, y: 0 }, scale: number = 1): Stage {
  const stage: Stage = { name, d, a, scale, draggables: [] };
  state.value.stages.push(stage);
  return stage;
}

function addDraggable(stageName: string, name: string, item: Coordinates = { x: 0, y: 0 }, options: DraggableOptions = { sx: 1, sy: 1 }): Draggable {
  let stage = getStage(stageName);
  const draggable: Draggable = { name, item, options, stage }
  getStage(stageName).draggables.push(draggable);
  return draggable;
}

function getStage(name: string): Stage {
  const found: Stage | undefined = state.value.stages.find((s: Stage) => s.name === name);
  if (found === undefined) {
    const stage: Stage = { name, d: { x: 0, y: 0 }, a: { x: 0, y: 0 }, scale: 1, draggables: [ ] };
    state.value.stages.push(stage);
    return stage;
  }
  return found;
}

function getDraggable(stage: Stage, name: string): Draggable {
  const found: Draggable | undefined = stage.draggables.find((d: Draggable) => d.name === name);
  return found ?? addDraggable(stage.name, name, { x: 0, y: 0 }, { sx: 0, sy: 0 });
}

function startDrag(stageName: string, name: string, $event: MouseEvent) {
  const stage: Stage = getStage(stageName);
  const draggable = getDraggable(stage, name);

  stage.strategy = new ItemDragStrategy(stage, draggable.item, 5, 5);
  stage.strategy.start($event);
}

function moveDrag(stageName: string, $event: MouseEvent) {
  const stage = getStage(stageName);
  stage.strategy?.move($event);
}

function setScale(name: string, scale: number) {
  const stage: Stage = getStage(name);
  stage.scale = scale;
}

function reset(name: string) {
  const stage: Stage = getStage(name);
  stage.strategy = undefined;
}

function startPanning(name: string, $event: MouseEvent) {
  const stage: Stage = getStage(name);
  stage.strategy = new StagePanStrategy(stage);
  stage.strategy.start($event);
}

export function useDraggables() {
  return {
    addDraggable, declare, getStage, moveDrag, reset, startPanning, setScale, startDrag
  }
}