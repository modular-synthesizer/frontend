import IPort from "./IPort";
import { InnerLink, InnerNode } from "./ITool";

export default interface IModule {
  id: string;
  innerNodes: InnerNode[];
  innerLinks: InnerLink[];
  rack: number;
  slot: number;
  slots: number;
  type: string;
  inputs: IPort[]
  outputs: IPort[]
}