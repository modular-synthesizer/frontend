import IMembership from "./IMembership";
import { Identifiable } from "../common/Identifiable";

export default interface ISynthesizer extends Identifiable {
  creator?: IMembership,
  members: IMembership[],
  name: string;
  x: number;
  y: number;
  scale: number;
  voices: number;

  membershipType(username: string): string;
}