import { remove } from "lodash";
import { repositories } from "~/lib/repositories";
import type { Cable } from "~/types/Index";
import { disconnectCable } from "../factories/cables";

export async function deleteCable(cable: Cable, cables: Array<Cable>) {
  disconnectCable(cable);
  remove(cables, { id: cable.id })
  await repositories.links.delete(cable.id);
}