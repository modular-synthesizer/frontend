import { api } from "~~/lib/api/Api";
import ITool, { InnerNode } from "~~/lib/interfaces/ITool";

export function deleteInnerNode(nodes: InnerNode[], node: InnerNode, tool: ITool) {
  nodes.slice(nodes.indexOf(node), 1);
  api.auth_delete(`/tools/nodes/${node.id}`, { tool_id: tool.id })
}

export function insertInnerNode(nodes: InnerNode[], node: InnerNode, tool: ITool) {
  nodes.push(node);
  api.auth_post('/tools/nodes', { ...node, tool_id: tool.id });
}

export function saveInnerNode(nodes: InnerNode[], node: InnerNode, tool: ITool) {
  deleteInnerNode(nodes, node, tool);
  insertInnerNode(nodes, node, tool);
}