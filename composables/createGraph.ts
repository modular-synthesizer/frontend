import IGraphParameter from "~~/lib/interfaces/toolGraph/IGraphParameter";
import ITool, { InnerNode } from "../interfaces/ITool";
import IGraph from "../interfaces/toolGraph/IGraph";
import IGraphNode from "../interfaces/toolGraph/IGraphNode";
import { IToolParameter, IToolPort, InnerLink } from "~~/lib/interfaces/ITool";
import IParameter from "~~/lib/interfaces/IParameter";
import { findIndex } from "lodash";
import IGraphLink from "~~/lib/interfaces/toolGraph/IGraphLink";
import IGraphPort from "~~/lib/interfaces/toolGraph/IGraphPort";
import { IControl } from "~~/lib/interfaces/IControl";

export default async function createGraph(tool: ITool): IGraph {
  await useDescriptors().fetchDescriptors();
  const graph: IGraph = {
    nodes: createNodes(tool),
    links: [],
    ports: [],
  };
  graph.links = createLinks(tool, graph.nodes);
  graph.ports = createPorts(tool, graph.nodes);
  return graph;
}

function createNodes(tool: ITool): IGraphNode[] {
  return tool.nodes.map((node: InnerNode) => {
    const graphNode: IGraphNode = {
      x: node.x,
      y: node.y,
      label: node.name,
      subtitle: node.generator,
      parameters: []};
    graphNode.parameters = createParameters(tool, node);
    return graphNode;
  });
}

function createParameters(tool: ITool, node: IGraphNode): IGraphParameter[] {
  const params: IToolParameter[] = tool.parameters.filter((p: IToolParameter) => {
    return p.targets.includes(node.name);
  });
  const graphParams: IGraphParameter[] = [];
  params.forEach((p: IToolParameter, idx: number) => {
    const descriptor: IParameter = useDescriptors().parameters.find((d: IParameter) => {
      return d.id === p.descriptorId;
    }) as IParameter;
    if (findIndex(graphParams, {label: descriptor.field}) < 0) {
      graphParams.push({ x: node.x + 20, y: node.y + 50 + (idx * 30), label: descriptor.field});
    }
  });
  return graphParams;
};

function getNode(nodes: IGraphNode[], name: string): IGraphNode {
  return nodes.find((n: IGraphNode) => n.label === name)
}

function createLinks(tool: ITool, nodes: IGraphNode[]): IGraphLink[] {
  return tool.links.map((link: InnerLink): IGraphLink => {
    const from: IGraphNode = getNode(nodes, link.from.node);
    if ( link.to.node.match(/^[^.]*$/)) {
      const dest: IGraphNode = getNode(nodes, link.to.node);
      return { x1: from.x + 200, x2: dest.x, y1: from.y + 25, y2: dest.y + 25 }
    }
    else {
      const [node, param] = link.to.node.split('.');
      const dest: IGraphNode = getNode(nodes, node);
      const paramDest: IGraphParameter = dest.parameters.find((p: IGraphParameter) => {
        return p.label === param;
      }) as IGraphParameter;
      return { x1: from.x + 200, x2: paramDest.x, y1: from.y + 25, y2: paramDest.y + 15 }
    }
  });
}

function createPorts(tool: ITool, nodes: IGraphNode): IGraphPort[] {
  return tool.ports.map((p: IToolPort) => {
    const node: IGraphNode = nodes.find((n: IGraphNode) => n.label === p.target);
    const control: IControl = tool.controls.find((c: IControl) => {
      return c.payload['target'] === node.label
    });
    return {
      x: node.x + (p.kind === 'input' ? 0 : 200),
      y: node.y + 25,
      type: p.kind
    }
  });
}