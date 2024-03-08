import { IControl } from "./IControl";
import IParameter from "./IParameter";
import IPort from "./IPort";
import { InnerLink, InnerNode } from "./ITool";
import { Identifiable } from "./common/Identifiable";
import IPlacableModule from "./synthesizers/IPlacableModule";

export default interface IModule extends IPlacableModule, Identifiable {
  nodes: InnerNode[];
  links: InnerLink[];
  type: string;
  ports: IPort[];
  parameters: IParameter[];
  category: string;
  controls: IControl[];
}