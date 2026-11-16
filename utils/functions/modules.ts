import type { AudioModule, ModulePayload } from "~/types/modules/AudioModule";
import { repositories } from '~/lib/repositories';
import type { Generator } from '~/types/Index';
import { createModule } from '../factories/modules';
import { find } from 'lodash';

export function deleteModule(module: AudioModule) {
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
export async function appendModule(modules: Ref<AudioModule[]>, module: ModulePayload, generators: Promise<Ref<Generator[]>>) {
  if (find(modules.value, { id: module.id })) return;
  if (modules.value === undefined) modules.value = []
  const instance: AudioModule = await createModule(module, generators);
  modules.value.push(instance);
}