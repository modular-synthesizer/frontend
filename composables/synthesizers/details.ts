import { find, remove, uniqBy } from "lodash";
import ModulesFactory from "~~/lib/factories/ModulesFactory";
import type { Generator } from "~/types/Generator";
import type ILink from "~~/lib/interfaces/ILink";
import type IModule from "~~/lib/interfaces/modules/IModule";
import type ISynthesizer from "~~/lib/interfaces/synthesizers/ISynthesizer";
import { managers } from "~~/lib/managers";
import { repositories } from "~~/lib/repositories";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import { useAudio } from "./useAudio";
import type { Cable } from "~/types/Cable";
import { createCable } from "~/utils/factories/cables";
import { stopChannels } from "~/utils/functions/channels";
import { getCables } from "~/utils/functions/modules";
import type { PlacedModule } from "~/types/modules/AudioModule";

/** The currently displayed synthesizer, mainly used for position and zoom level */
let synthesizer!: Ref<Synthesizer>;
/** The list of currently displayed modules */
const modules: Ref<PlacedModule[]> = ref([]);
/** The list of currently displayed links */
const links: Ref<Cable[]> = ref([]);

export function useSynthesizer() {

  /**
   * Fetches a synthesizer WITHOUT all the needed elements from it (modules, links, managers, etc.).
   * @param id the unique UUID of the synthesizer to get informations from.
   * @returns a synthesizer class object instanciated from the details got in the API.
   */
  async function fetch(id: string): Promise<void> {
    const details: ISynthesizer = await repositories.synthesizers.get(id);
    initializeManagers(details);
    // @ts-ignore
    synthesizer = ref(new Synthesizer(details));
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
    console.log(ilinks);
    await buildLinks(ilinks);
  }

  async function fetchChildren(synthesizer: ISynthesizer): Promise<any> {
    return await Promise.all([
      repositories.generators.list(),
      repositories.modules.list(synthesizer),
      repositories.links.list(synthesizer),
    ]);
  }

  async function buildModules(list: IModule[], synthesizer: Synthesizer, generators: Generator[]) {
    const mods: PlacedModule[] = await Promise.all(list.map((imod: IModule) => {
      return ModulesFactory.build(imod as unknown as IModule, synthesizer, generators);
    }))
    mods.forEach((mod: PlacedModule) => {
      synthesizer.place(mod.rack, mod.slot, mod);
      modules.value.push(mod);
    });
    synthesizer.setModules(modules.value);
  }

  async function buildLinks(list: ILink[]) {
    console.log(list.filter((ilink: ILink) => {
      return find(usePorts().ports, {id: ilink.from}) !== undefined
          && find(usePorts().ports, {id: ilink.to}) !== undefined
    }));
    list.filter((ilink: ILink) => {
      return find(usePorts().ports, {id: ilink.from}) !== undefined
          && find(usePorts().ports, {id: ilink.to}) !== undefined
    })
    .forEach((link: ILink) => {
      links.value.push(createCable(link.id, link.from, link.to, link.color, usePorts().ports));
    });
    console.log(links.value)
  }

  /**
   * Signals to the entities managing the keyboard and MIDI inputs that the synthesizer has changed.
   * @param details the informations about the synthesizer to handle now (mainly to get the number of voices).
   */
  function initializeManagers(details: ISynthesizer) {
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
    modules.value.forEach((m: PlacedModule) => stopChannels(m.channels));
    modules.value = [];
  }

  async function removeLink(cable: Cable) {
    cable.to.disconnect(cable.from);
    remove(links.value, cable);
    await repositories.links.delete(cable.id);
  }

  async function removeModule(mod: PlacedModule) {
    disconnectModule(mod);
    remove(modules.value, { id: mod.id });
    await repositories.modules.delete(mod.id);
  }

  async function disconnectModule(mod: PlacedModule) {
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