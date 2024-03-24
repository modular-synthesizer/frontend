import ICategory from "./ICategory";
import { IControl } from "./IControl";
import { Identifiable } from "./common/Identifiable";

export default interface ITool extends Identifiable {
  category: ICategory;
  categoryId: string;
  nodes: InnerNode[];
  links: InnerLink[];
  ports: IToolPort[];
  parameters: IToolParameter[];
  slots: number;
  controls: IControl[]
  experimental: boolean;
  name: string;
}

export interface IToolParameter extends Identifiable {
  targets: string[];
  name: string;
  descriptorId?: string,
  field: string;
  default: number,
  maximum: number,
  minimum: number,
  step: number,
  precision: number
}

export interface InnerNode extends Identifiable {
  name: string;
  generator: string;
  x: number;
  y: number;
  inputs: number;
  outputs: number;
}

export interface InnerLink extends Identifiable {
  from: { node: string, index: number };
  to: { node: string, index: number };
}

export interface IToolPort extends Identifiable {
  name: string;
  target: string;
  index: number;
  kind: string;
}