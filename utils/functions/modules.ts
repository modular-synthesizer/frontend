import type { Port } from '~/types/modules/Port';
import type { Cable } from "~/types/Cable";
import type { AudioModule, ModuleCoordinates, ModulePayload } from "~/types/modules/AudioModule";
import type { Identified } from "~/types/utils/Identified";
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import { deleteCable } from './cables';
import { repositories } from '~/lib/repositories';
import type { Generator, Synthesizer } from '~/types/Index';
import { createModule } from '../factories/modules';
import { find } from 'lodash';

type Intersectable = ModuleCoordinates & Identified

/**
 * Checks if a module intersects another one by checking if they are on the same "line", not the same module
 * (otherwise any module would intersect with himself) and if the start of one of the two modules is "inside" the other.
 * 
 * @param a the first module to check. 
 * @param b the second module to check.
 * @returns TRUE if a module intersects the other, FALSE otherwise.
 */
export function intersect(a: Intersectable, b: Intersectable): boolean {
  return inSameRack(a, b) && !equal(a, b) && (overlap(a, b) || overlap(b, a));
}

function inSameRack(first: ModuleCoordinates, second: ModuleCoordinates): boolean {
  return first.rack === second.rack
}

function equal(first: Identified, second: Identified): boolean {
  return first.id !== undefined && second.id !== undefined && first.id === second.id;
}

function overlap(a: ModuleCoordinates, b: ModuleCoordinates): boolean {
  return a.slot >= b.slot && a.slot < (b.slot + b.slots);
}

/**
 * Vanity methods used to aggregate all cables from and to a given module.
 * @param module the module having a list of ports that should be check to aggregate cables to/from them. 
 * @returns the complete list of cables linked to the module.
 */
export function getCables({ ports }: { ports: Array<Port> }): Array<Cable> {
  return ports.map((p: Port) => p.link).filter((c: Cable|undefined) => !!c);
}

export function place(module: AudioModule, rack: number, slot: number) {
  module.rack = rack;
  module.slot = slot;
  module.x = slot * SLOT_SIZE;
  module.y = rack * RACK_HEIGHT;
}

export function disconnectModule(module: AudioModule, cables: Array<Cable>) {
  getCables(module).forEach((c: Cable) => deleteCable(c, cables));
}

export function deleteModule(module: AudioModule, cables: Array<Cable>) {
  disconnectModule(module, cables);
  module.deleted = true;
  repositories.modules.delete(module.id, useSession().token);
}

/**
 * Instanciates and appends a module from the API in a given synthesizer.
 * It will first "instanciate" it (create the polyphony voices, the nodes, mlinking them, etc.),
 * then add it to the modules of the synthesizer so that he can manage it.
 * 
 * @param synthesizer the synthesizer receiving the newly instanciated module.
 * @param module the payload (informations) of the module to instanciate.
 */
export async function appendModule(synthesizer: Synthesizer, module: ModulePayload, generators: Generator[]) {
  if (find(synthesizer.modules, { id: module.id })) return;
  if (synthesizer.modules === undefined) synthesizer.modules = []
  const instance: AudioModule = await createModule(module, generators, synthesizer);
  synthesizer.modules.push(instance);
}

export async function appendModules(synthesizer: Synthesizer, modules: ModulePayload[], generators: Generator[]) {
  await Promise.all(modules.map(async (payload: ModulePayload) => {
    await appendModule(synthesizer, payload, generators)
  }));
}