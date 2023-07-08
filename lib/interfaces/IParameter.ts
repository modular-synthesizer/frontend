export default interface IParameter {
  id: string;
  name: string;
  value: number;
  minimum: number;
  maximum: number;
  step: number;
  precision: number;
  targets: string[];
  field: string;
}