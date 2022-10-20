export default interface IParameter {
  id: string;
  name: string;
  value: number;
  constraints: {
    minimum: number;
    maximum: number;
    step: number;
    precision: number;
  }
}