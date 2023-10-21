export enum Strategies {
  LINEAR = 'linear',
  DECORRELATED = 'decorrelated',
}

export type EditionStrategies = {
  [key in Strategies]: any;
};

export const EDITION_STRATEGIES: EditionStrategies = {
  "linear": editAsLinear,
  "decorrelated": editAsDecorrelated,
}

function editAsLinear() {

}

function editAsDecorrelated(y: number) {
  if (selectedParameter === null) return;
  const delta = y - yOrigin.value;
  if (Math.abs(delta) >= 5) {
    selectedParameter.moveValue(- (delta / 5) * selectedParameter.step);
    resetOrigin(y)
  }
}