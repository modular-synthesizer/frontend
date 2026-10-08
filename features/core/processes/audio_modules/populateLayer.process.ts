import type { PolyphonyLayer } from "../../data/AudioModule.type";
import type { InnerNodeTemplate } from "../../data/InnerNode.type";
import { createInLayer } from "../inner_nodes/create.process";

export const populateLayer = async (templates: InnerNodeTemplate[]): Promise<PolyphonyLayer> => {
  const layer: PolyphonyLayer = { innerNodes: [] }
  return { innerNodes: await Promise.all(templates.map(t => createInLayer(t, layer))) }
} 