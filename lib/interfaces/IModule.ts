import { IControl } from "./IControl";
import IParameter from "./IParameter";
import IPort from "./IPort";
import { InnerLink, InnerNode } from "./ITool";

export default interface IModule extends IPlacableModule {
  id: string;
  nodes: InnerNode[];
  links: InnerLink[];
  type: string;
  ports: IPort[];
  parameters: IParameter[];
  category: string;
  controls: IControl[];
}