import { find, remove } from "lodash";
import { repositories } from "~/lib/repositories";
import type { Cable, LinkPayload, Port } from "~/types/Index";
import { createCable, disconnectCable } from "../factories/cables";

export async function deleteCable(cable: Cable, cables: Array<Cable>) {
  disconnectCable(cable);
  remove(cables, { id: cable.id })
  await repositories.links.delete(cable.id);
}

export async function appendCable(payload: LinkPayload, cables: Cable[], ports: Port[]) {
  if (find(cables, { id: payload.id })) return;
  cables.push(await createCable(payload.id, payload.from, payload.to, payload.color, ports));
}

export async function appendCables(payloads: LinkPayload[], cables: Cable[], ports: Port[]) {
  return await Promise.all(payloads.map(async (payload: LinkPayload) => {
    return await appendCable(payload, cables, ports);
  }))
}