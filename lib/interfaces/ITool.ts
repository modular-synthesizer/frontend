export default interface ITool {
  name: string;
  category_id: string,
  inner_nodes: InnerNode[],
  inner_links: InnerLink[],
  inputs: IToolPort[],
  outputs: IToolPort[],
}

export interface InnerNode {
  name: string;
  generator: string;
}

export interface InnerLink {
  from: { node: string, index: number },
  to: { node: string, index: number }
}

export interface IToolPort {
  name: string,
  target: string,
  index: number
}