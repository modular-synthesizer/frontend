import { find, remove } from "lodash";
import type { Generator } from "~/types/Generator";
import { managers } from "~~/lib/managers";
import { repositories } from "~~/lib/repositories";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import { useAudio } from "./useAudio";
import type { Cable, LinkPayload } from "~/types/Cable";
import { createCable, disconnectCable } from "~/utils/factories/cables";
import { stopChannels } from "~/utils/functions/channels";
import { getCables, place } from "~/utils/functions/modules";
import type { AudioModule, ModulePayload } from "~/types/modules/AudioModule";
import { createModule } from "~/utils/factories/modules";
import type { Synthesizer } from "~/types/synthesizers/Synthesizer";

/** The currently displayed synthesizer, mainly used for position and zoom level */
let synthesizer!: Ref<Synthesizer>;
/** The list of currently displayed modules */
const modules: Ref<AudioModule[]> = ref([]);
/** The list of currently displayed links */
const links: Ref<Cable[]> = ref([]);

export function useSynthesizer() {

  /**
   * Fetches a synthesizer WITHOUT all the needed elements from it (modules, links, managers, etc.).
   * @param id the unique UUID of the synthesizer to get informations from.
   * @returns a synthesizer class object instanciated from the details got in the API.
   */
  async function fetch(id: string): Promise<void> {
    synthesizer = ref(await repositories.synthesizers.get(id));
    initializeManagers(synthesizer.value);
  }

  /**
   * Initializes the main components of a synthesizer : modules, links, and the corresponding audio resources,
   * like processors for custom nodes, and the audio context to be able to start all web audio API nodes in it.
   */
  async function initialize(): Promise<void> {
    if (synthesizer.value === null) return;
    await useAudio().initContext();
    await loadProcessors(useAudio().context as AudioContext);
    const [ generators, imodules, ilinks ] = await fetchChildren(synthesizer.value);
    await buildModules(imodules, synthesizer.value, generators);
    await buildLinks(ilinks);
  }

  async function fetchChildren(synthesizer: Synthesizer): Promise<any> {
    return await Promise.all([
      repositories.generators.list(useSession().token),
      repositories.modules.list(useSession().token, synthesizer),
      repositories.links.list(synthesizer),
    ]);
  }

  async function buildModules(list: Array<ModulePayload>, synthesizer: Synthesizer, generators: Generator[]) {
    const mods: Array<AudioModule> = await Promise.all(list.map((details: ModulePayload) => createModule(details, generators, synthesizer)));
    mods.forEach((mod: AudioModule) => {
      place(mod, mod.rack, mod.slot);
      modules.value.push(mod);
    });
    synthesizer.modules = modules.value;
  }

  async function buildLinks(list: Array<LinkPayload>) {
    list.filter((ilink: LinkPayload) => {
      return find(usePorts().ports, {id: ilink.from}) !== undefined
          && find(usePorts().ports, {id: ilink.to}) !== undefined
    })
    .forEach((link: LinkPayload) => {
      links.value.push(createCable(link.id, link.from, link.to, link.color, usePorts().ports));
    });
  }

  /**
   * Signals to the entities managing the keyboard and MIDI inputs that the synthesizer has changed.
   * @param details the informations about the synthesizer to handle now (mainly to get the number of voices).
   */
  function initializeManagers(details: Synthesizer) {
    managers.keyboard.setSynthesizer(details);
    managers.midi.setSynthesizer(details);
  }

  function stop() {
    eventbus.emit('synthesizers/quit')
    usePorts().reset();
    links.value = []
    stopModules();
    stopManagers();
    useAudio().context?.suspend();
  }

  function stopModules() {
    modules.value.forEach((m: AudioModule) => stopChannels(m.channels));
    modules.value = [];
  }

  async function removeLink(cable: Cable) {
    disconnectCable(cable);
    remove(links.value, { id: cable.id });
    await repositories.links.delete(cable.id);
  }

  async function removeModule(mod: AudioModule) {
    disconnectModule(mod);
    remove(modules.value, { id: mod.id });
    await repositories.modules.delete(mod.id, useSession().token);
  }

  async function disconnectModule(mod: AudioModule) {
    getCables(mod).forEach(useSynthesizer().removeLink);
  }

  async function resetReference() {
    synthesizer.value.x = 0;
    synthesizer.value.y = 0;
    synthesizer.value.scale = 1.0;
  }

  return {
    fetch, initialize, stop, modules, links, synthesizer, removeLink, disconnectModule, removeModule, resetReference
  }
}