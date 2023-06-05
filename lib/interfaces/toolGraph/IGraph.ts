import IGraphLink from "./IGraphLink";
import IGraphNode from "./IGraphNode";
import IGraphPort from "./IGraphPort";

/**
 * Represents the whole graph structure to display. It contains the nodes, links, parameters and ports of the tool,
 * represented with coordinates to be displayed in the SVG graph correctly without much work.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default interface IGraph {
  nodes: IGraphNode[];
  links: IGraphLink[];
  ports: IGraphPort[];
}