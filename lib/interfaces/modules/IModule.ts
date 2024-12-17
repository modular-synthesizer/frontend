import type { IControl } from "../IControl";
import type IPort from "../IPort";
import type { InnerNode } from "~/types/tools/InnerNode";
import type { InnerLink } from "~/types/tools/InnerLink";
import type { Identifiable } from "../common/Identifiable";
import type IPlacableModule from "./IPlacableModule";
import type { Parameter } from "~/types/modules/Parameter";

export default interface IModule extends IPlacableModule, Identifiable {
  nodes: InnerNode[];
  links: InnerLink[];
  type: string;
  ports: IPort[];
  parameters: Parameter[];
  category: string;
  controls: IControl[];
}