export default interface ITool {
  id: string,
  name: string;
  category_id: string,
  innerNodes: InnerNode[],
  innerLinks: InnerLink[],
  inputs: IToolPort[],
  outputs: IToolPort[],
  parameters: IToolParameter[],
  slots: number
}

export interface IToolParameter {
  descriptor: string;
  targets: string[]
}

export interface InnerNode {
  name: string;
  generator: string;
}

export interface InnerLink {
  from: { node: string, index: number },
  to: { node: string, index: number },
  color: string;
}

export interface IToolPort {
  name: string,
  target: string,
  index: number
}