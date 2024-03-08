import { Identifiable } from "./common/Identifiable";

export default interface IPort extends Identifiable {
  index: number;
  name: string;
  target: string;
  kind: string;
}