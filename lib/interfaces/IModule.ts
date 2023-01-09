import IParameter from "./IParameter";
import IPort from "./IPort";
import { InnerLink, InnerNode } from "./ITool";

export default interface IModule {
  id: string;
  nodes: InnerNode[];
  links: InnerLink[];
  rack: number;
  slot: number;
  slots: number;
  type: string;
  inputs: IPort[];
  outputs: IPort[];
  parameters: IParameter[];
  category: string;
}