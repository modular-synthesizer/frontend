import { api } from "~~/lib/api/Api";
import ITool, { InnerLink, InnerNode, IToolParameter, IToolPort } from "~~/lib/interfaces/ITool";
import { repositories } from "~~/lib/repositories";

type ToolElement = IToolPort|IToolParameter|InnerNode|InnerLink;

function getCollection(tool: ITool, path: string): ToolElement[] {
  return tool[path as keyof ITool] as ToolElement[];
}

export function createElement(uri: string, tool: ITool) {
  return async function(element: ToolElement,) {
    getCollection(tool, uri).push(await api.auth_post(`/tools/${uri}`, { ...element, tool_id: tool.id }));
  }
};

export async function updateTool(tool: ITool) {
  return await repositories.tools.update(tool);
}