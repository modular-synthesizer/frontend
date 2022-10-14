export default class ISimpleSynthesizer {
  id: string;
  name: string;
  nodes_count: number;
  links_count: number;
}

export class ISynthesizer {
  id: string;
  name: string;
  slots: number;
  racks: number;
  x: number;
  y: number;
  scale: number;
}