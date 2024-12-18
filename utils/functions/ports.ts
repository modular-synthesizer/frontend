import type Port from "~/lib/wrappers/Port";
import type { ToolPort } from "~/types/tools/Port";

export function isInput(port: ToolPort|Port) {
  return port.kind === 'input';
}