import ICategory from "./ICategory";

export default interface ITool {
  id: string;
  name: string;
  category: ICategory;
  categoryId: string;
  nodes: InnerNode[];
  links: InnerLink[];
  inputs: IToolPort[];
  outputs: IToolPort[];
  parameters: IToolParameter[];
  slots: number;
}

export interface IToolParameter {
  descriptorId: string;
  targets: string[];
  name: String;
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
}

export interface IControl {
  component: string;
  payload: any;
}