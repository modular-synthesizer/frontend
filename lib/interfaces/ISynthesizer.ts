export default interface ISynthesizer {
  id: string;
  creator?: {
    username: string,
    id: string
  },
  name: string;
  slots: number;
  racks: number;
  x: number;
  y: number;
  scale: number;
}