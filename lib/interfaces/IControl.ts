import { Identifiable } from "./common/Identifiable";

export interface IControl extends Identifiable {
  component: string;
  payload: any;
  editing: boolean;
}