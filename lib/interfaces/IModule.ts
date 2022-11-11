import { InnerNode } from "./ITool";

export default interface IModule {
  innerNodes: InnerNode[];
  rack: number;
  slot: number;
  slots: number;
}