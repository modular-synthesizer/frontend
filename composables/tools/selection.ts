import { remove } from "lodash";
import { api } from "~~/lib/api/Api";
import ITool, { InnerLink, InnerNode, IToolPort } from "~~/lib/interfaces/ITool";

export type Selectable = IToolPort|InnerNode|InnerLink|null
export type Resource = 'ports'|'nodes'|'links'|''

interface IToolSelection {
  item: Selectable;
  uri: string;
  tool: ITool|null;
}

export const selected: Ref<IToolSelection> = ref({ item: null, uri: '', tool: null });

export function selectItem(item: Selectable, uri: Resource = '', tool: ITool|null = null) {
  selected.value.item = item;
  selected.value.uri = uri;
  if (tool !== null) selected.value.tool = tool;
}

export async function deleteSelectedItem() {
  const { item, tool, uri } = selected.value;
  if (item === null || tool === null) return;
  selectItem(null);
  remove(tool[uri as keyof ITool] as unknown as any[], (item: any) => item.id === item.id);
  return await api.auth_delete(`/tools/${uri}/${item.id}`, { tool_id: tool.id, ...item })
}

function handleKeydown(event: KeyboardEvent) {
  if (selected.value.item === null) return;
  if (event.code === 'Delete') deleteSelectedItem();
}

export function isNodeSelected(selection: Selectable): selection is InnerNode {
  return selection !== null && 'x' in (<InnerNode>selection);
}

export function declareDeletionHandlers(window: Window, onunload: Function) {
  window.addEventListener('keydown', handleKeydown);
  onunload(() => window.removeEventListener('keydown', handleKeydown));
}