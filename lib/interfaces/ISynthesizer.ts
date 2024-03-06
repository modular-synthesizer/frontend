import IMembership from "./IMembership";

export default interface ISynthesizer {
  id: string;
  creator?: IMembership,
  members: IMembership[],
  name: string;
  x: number;
  y: number;
  scale: number;
  voices: number;
}