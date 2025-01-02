import { renderToString } from "vue/server-renderer"
import Stage from "~/components/draggable/Stage.vue"
import type { Coordinates } from "~/types/utils/Coordinates"

export type Stage = {
  name: string,
  // The offset coordinates of the stage INSIDE (how is it moved from its 0;0 point).
  d: Coordinates,
  // The offset coordinates of the stage OUTSIDE (where is it on the screen currently).
  a: Coordinates,
  scale: number
  draggables: Array<Draggable>,
  // The current drag origin on this stage, updated when a drag is started.
  drag: Drag,
  panning: boolean,
  pan: Drag,
}

type DraggableOptions = {
  sx: number,
  sy: number,
}

export type Draggable = {
  name: string,
  item: Coordinates,
  dragged: boolean,
  options: DraggableOptions,
  stage: Stage,
}

type Drag = {
  // The origin coordinates of the dragged item, needed to re-compute it every step.
  item: Coordinates,
  // The origin coordinates of the drag start event, needed to get the offset.
  event: Coordinates,
}

type State = {
  stages: Array<Stage>,
}

const state: Ref<State> = ref({ stages: [] })

function emptyDrag(): Drag {
  return { event: { x: 0, y: 0 }, item: { x: 0, y: 0 } };
}

/**
 * 
 * @param name Declares a new stage where elements can be dragged and dropped by the user.
 * @param dx the current offset of the stage on the X axis.
 * @param dy the current offset of the stage on the Y axis.
 * @param scale the current level of zoom of the stage, used to infer coordinates.
 * @param options Some configuration options, like the number of pixels of a drag step, etc.
 */
function declare(name: string, d: Coordinates = { x: 0, y: 0 }, a: Coordinates = { x: 0, y: 0 }, scale: number = 1): Stage {
  const stage: Stage = { name, d, a, scale, draggables: [], drag: emptyDrag(), panning: false, pan: emptyDrag() };
  state.value.stages.push(stage);
  return stage;
}

function addDraggable(stageName: string, name: string, item: Coordinates = { x: 0, y: 0 }, options: DraggableOptions = { sx: 1, sy: 1 }): Draggable {
  let stage = getStage(stageName);
  const draggable: Draggable = { name, item, dragged: false, options, stage }
  getStage(stageName).draggables.push(draggable);
  return draggable;
}

function getStage(name: string): Stage {
  const found: Stage | undefined = state.value.stages.find((s: Stage) => s.name === name);
  if (found === undefined) {
    const stage: Stage = { name, d: { x: 0, y: 0 }, a: { x: 0, y: 0 }, scale: 1, draggables: [ ], drag: emptyDrag(), panning: false, pan: emptyDrag() };
    state.value.stages.push(stage);
    return stage;
  }
  return found;
}

function getDraggable(stage: Stage, name: string): Draggable {
  const found: Draggable | undefined = stage.draggables.find((d: Draggable) => d.name === name);
  return found ?? addDraggable(stage.name, name, { x: 0, y: 0 }, { sx: 0, sy: 0 });
}

function createDrag(stage: Stage, draggable: Coordinates, $event: MouseEvent): Drag {
  return {
    event: projectEvent(stage, $event),
    item: { x: draggable.x, y: draggable.y },
  }
}

function projectEvent(stage: Stage, $event: MouseEvent) {
  return {
    x: Math.round(($event.clientX - stage.a.x) / stage.scale),
    y: Math.round(($event.clientY - stage.a.y) / stage.scale),
  }
}

function startDrag(stageName: string, name: string, $event: MouseEvent) {
  const stage: Stage = getStage(stageName);
  const draggable = getDraggable(stage, name);
  draggable.dragged = true;
  stage.drag = createDrag(stage, draggable.item, $event);
  console.log(`[${draggable.item.x} ; ${draggable.item.y}]`);
}

function moveDrag(stageName: string, $event: MouseEvent) {
  const stage = getStage(stageName);
  if (stage.panning) {
    const delta: Coordinates = {
      x: $event.clientX - stage.pan.event.x,
      y: $event.clientY - stage.pan.event.y
    }
    stage.d.x = stage.pan.item.x + delta.x;
    stage.d.y = stage.pan.item.y + delta.y;
    return;
  }
  const draggable = stage.draggables.find((d: Draggable) => d.dragged === true);
  if (draggable === undefined) return;
  const offset: Coordinates = projectEvent(stage, $event);
  offset.x -= stage.drag.event.x;
  offset.y -= stage.drag.event.y;

  draggable.item.x = round(stage.drag.item.x + offset.x, draggable.options.sx);
  draggable.item.y = round(stage.drag.item.y + offset.y, draggable.options.sy);
}

function round(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function setScale(name: string, scale: number) {
  const stage: Stage = getStage(name);
  stage.scale = scale;
}

function reset(name: string) {
  console.log("resetting");
  const stage: Stage = getStage(name);
  stage.draggables.forEach((d: Draggable) => {
    d.dragged = false;
  });
  stage.panning = false;
}

function startPanning(name: string, $event: MouseEvent) {
  const stage: Stage = getStage(name);
  stage.panning = true;
  stage.pan = {
    event: { x: $event.clientX, y: $event.clientY },
    item: { x: stage.d.x, y: stage.d.y },
  }
}

export function useDraggables() {
  return {
    addDraggable, declare, getStage, moveDrag, reset, startPanning, setScale, startDrag
  }
}