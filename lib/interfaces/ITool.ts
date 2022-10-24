export default interface ITool {
  name: string;
  category_id: string,
  inner_nodes: InnerNode[],
  inner_links: InnerLink[]
}

export interface InnerNode {
  name: string;
  generator: string;
}

export interface InnerLink {

}