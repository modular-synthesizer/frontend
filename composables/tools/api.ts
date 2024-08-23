import { curry } from "lodash";
import { api } from "~~/lib/api/Api";
import ITool, { InnerLink, InnerNode, IToolParameter, IToolPort } from "~~/lib/interfaces/ITool";

type ToolElement = IToolPort|IToolParameter|InnerNode|InnerLink;

function getCollection(tool: ITool, path: string): ToolElement[] {
  return tool[path as keyof ITool] as ToolElement[];
}

export function createElement(uri: string, tool: ITool) {
  return async function(element: ToolElement,) {
    getCollection(tool, uri).push(await api.auth_post('/tools/ports', { ...element, tool_id: tool.id }));
  }
};

export const updateElement = curry(async function (uri: string, tool: ITool, element: ToolElement) {
  const updatedPort: IToolPort = await api.auth_put(`/tools/${uri}/${element.id}`, { ...element, tool_id: tool.id });
  const collection: ToolElement[] = getCollection(tool, uri);
  const index: number = collection.findIndex((e: ToolElement) => e.id === element.id);
  if (index > -1) collection[index] = updatedPort;
})

export async function updateTool(tool: ITool) {
  return await api.auth_put(`/tools/${tool.id}`, tool);
}