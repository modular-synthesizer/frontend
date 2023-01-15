import ICategory from "./ICategory";
import { IControl } from "./IControl";

export default interface ITool {
  id: string;
  name: string;
  category: ICategory;
  categoryId: string;
  nodes: InnerNode[];
  links: InnerLink[];
  ports: IToolPort[];
  parameters: IToolParameter[];
  slots: number;
  controls: IControl[]
}

export interface IToolParameter {
  id: string;
  targets: string[];
  name: String;
  constraints: {
    maximum: number,
    minimum: number,
    step: number,
    precision: number
  }
}

export interface InnerNode {
  name: string;
  generator: string;
}

export interface InnerLink {
  from: { node: string, index: number };
  to: { node: string, index: number };
}

export interface IToolPort {
  name: string;
  target: string;
  index: number;
  kind: string;
}