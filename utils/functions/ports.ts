import { find } from "lodash";
import type { AudioModule } from "~/types/modules/AudioModule";
import type { Port } from '~/types/modules/Port';
import type { ToolPort } from "~/types/blueprints/Port";

export function isInput(port: ToolPort|Port) {
  return port.kind === 'input';
}

export function getPort(id: string, modules: Array<AudioModule>): Port | undefined {
  for (let module of modules) {
    const found: Port | undefined = find(module.ports, { id });
    if (found !== undefined) return found;
  };
  return undefined;
}