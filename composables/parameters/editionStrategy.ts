export enum Strategies {
  LINEAR = 'linear',
  DECORRELATED = 'decorrelated',
}

export type EditionStrategies = {
  [key in Strategies]: any;
};

export const EDITION_STRATEGIES: EditionStrategies = {
  [Strategies.LINEAR]: editAsLinear,
  [Strategies.DECORRELATED]: editAsDecorrelated,
}

function editAsLinear({ clientY: y, clientX: x }: MouseEvent) {

}

function editAsDecorrelated({ clientY: y, clientX: x }: MouseEvent) {
  if (selectedParameter === null) return;
  const delta = y - parameterOrigin.y;
  if (Math.abs(delta) >= 5) {
    selectedParameter.moveValue(- (delta / 5) * selectedParameter.step);
    resetOrigin({ x, y });
  }
}