import { Identifiable } from "./common/Identifiable";

export interface IGenerator extends Identifiable {
  name: string;
  code: string;
}