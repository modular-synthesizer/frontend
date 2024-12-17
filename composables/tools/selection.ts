import { remove } from "lodash";
import type { Tool } from '~~/types/tools/Tool';
import type { ToolPort } from '~~/types/tools/Port';
import type { InnerLink } from '~~/types/tools/InnerLink';
import type { InnerNode } from '~~/types/tools/InnerNode';

export type Selectable = ToolPort|InnerNode|InnerLink|null
export type Resource = 'ports'|'nodes'|'links'|''

interface IToolSelection {
  item: Selectable;
  uri: string;
  tool: Tool|null;
}

export const selected: Ref<IToolSelection> = ref({ item: null, uri: '', tool: null });

export function selectItem(item: Selectable, uri: Resource = '', tool: Tool|null = null) {
  selected.value.item = item;
  selected.value.uri = uri;
  if (tool !== null) selected.value.tool = tool;
}

export async function deleteSelectedItem() {
  const { item, tool, uri } = selected.value;
  if (item === null || tool === null) return;
  remove(tool[uri as keyof Tool] as unknown as any[], (i: any) => i.id === item.id);
  selectItem(null);
  return await api_delete(`/proxy/tools/${uri}/${item.id}`, { tool_id: tool.id, ...item })
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