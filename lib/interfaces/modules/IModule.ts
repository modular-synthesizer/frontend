import type IPort from "../IPort";
import type { InnerNode } from "~/types/tools/InnerNode";
import type { InnerLink } from "~/types/tools/InnerLink";
import type { Identifiable } from "../common/Identifiable";
import type { Parameter } from "~/types/modules/Parameter";
import type { Control } from "~/types/tools/Control";
import type { ModuleCoordinates } from "~/types/modules/AudioModule";

export default interface IModule extends ModuleCoordinates, Identifiable {
  nodes: InnerNode[];
  links: InnerLink[];
  type: string;
  ports: IPort[];
  parameters: Parameter[];
  category: string;
  controls: Control[];
}