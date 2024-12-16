import { IControl } from "../IControl";
import IParameter from "../IParameter";
import IPort from "../IPort";
import type { InnerNode } from "~/types/tools/InnerNode";
import type { InnerLink } from "~/types/tools/InnerLink";
import { Identifiable } from "../common/Identifiable";
import IPlacableModule from "./IPlacableModule";

export default interface IModule extends IPlacableModule, Identifiable {
  nodes: InnerNode[];
  links: InnerLink[];
  type: string;
  ports: IPort[];
  parameters: IParameter[];
  category: string;
  controls: IControl[];
}