import { InnerNode } from "./ITool";

export default interface IModule {
  id: string;
  innerNodes: InnerNode[];
  rack: number;
  slot: number;
  slots: number;
  type: string;
}