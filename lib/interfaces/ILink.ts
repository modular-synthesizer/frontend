import { Identifiable } from "./common/Identifiable";

export default interface ILink extends Identifiable {
  color: string;
  from: string;
  to: string;
}