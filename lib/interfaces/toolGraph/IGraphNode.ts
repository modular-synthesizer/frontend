import IGraphParameter from "./IGraphParameter";

export default interface IGraphNode {
  x: number;
  y: number;
  label: string;
  subtitle: string;

  parameters: IGraphParameter[];
}