import type { Tool } from '~~/types/tools/Tool';
import type { InnerNode } from '~~/types/tools/InnerNode';

export function deleteInnerNode(nodes: InnerNode[], node: InnerNode, tool: Tool) {
  nodes.slice(nodes.indexOf(node), 1);
  api_delete(`/tools/nodes/${node.id}`, { tool_id: tool.id })
}

export function insertInnerNode(nodes: InnerNode[], node: InnerNode, tool: Tool) {
  nodes.push(node);
  api_post('/tools/nodes', { ...node, tool_id: tool.id });
}

export function saveInnerNode(nodes: InnerNode[], node: InnerNode, tool: Tool) {
  deleteInnerNode(nodes, node, tool);
  insertInnerNode(nodes, node, tool);
}