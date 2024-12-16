import type { ComponentNames } from "~/types/tools/Control";
import { Identifiable } from "./common/Identifiable";

export interface IControl extends Identifiable {
  component: ComponentNames;
  payload: any;
  editing: boolean;
}