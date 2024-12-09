import { find, remove, uniqBy } from "lodash";
import ModulesFactory from "~~/lib/factories/ModulesFactory";
import { IGenerator } from "~~/lib/interfaces/IGenerator";
import ILink from "~~/lib/interfaces/ILink";
import IModule from "~~/lib/interfaces/modules/IModule";
import ISynthesizer from "~~/lib/interfaces/synthesizers/ISynthesizer";
import { managers } from "~~/lib/managers";
import { repositories } from "~~/lib/repositories";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import Link from "~~/lib/wrappers/Link";
import Mod from "~~/lib/wrappers/Mod";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import { useAudio } from "./useAudio";

/** The currently displayed synthesizer, mainly used for position and zoom level */
let synthesizer!: Ref<Synthesizer>;
/** The list of currently displayed modules */
const modules: Ref<Mod[]> = ref([]);
/** The list of currently displayed links */
const links: Ref<Link[]> = ref([]);

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
    await buildLinks(ilinks);
  }

  async function fetchChildren(synthesizer: ISynthesizer): Promise<any> {
    return await Promise.all([
      repositories.generators.list(),
      repositories.modules.list(synthesizer),
      repositories.links.list(synthesizer),
    ]);
  }

  async function buildModules(list: IModule[], synthesizer: Synthesizer, generators: IGenerator[]) {
    const mods: Mod[] = await Promise.all(list.map((imod: IModule) => {
      return ModulesFactory.build(imod as unknown as IModule, synthesizer, generators);
    }))
    mods.forEach((mod: Mod) => {
      synthesizer.place(mod.rack, mod.slot, mod);
      modules.value.push(mod);
    });
    synthesizer.setModules(modules.value);
  }

  async function buildLinks(list: ILink[]) {
    list.filter((ilink: ILink) => {
      return find(usePorts().ports, {id: ilink.from}) !== undefined
          && find(usePorts().ports, {id: ilink.to}) !== undefined
    })
    .forEach((ilink: ILink) => links.value.push(new Link(ilink)));
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
    modules.value.forEach((m: Mod) => m.stop());
    modules.value = [];
  }

  async function removeLink(id: string) {
    const found: Link|undefined = find(links.value, { id })
    if (found === undefined) return;
    found.disconnect();
    remove(links.value, { id });
    await repositories.links.delete(id);
  }

  async function removeModule(mod: Mod) {
    disconnectModule(mod);
    remove(modules.value, { id: mod.id });
    await repositories.modules.delete(mod.id);
  }

  async function disconnectModule(mod: Mod) {
    mod.connections.forEach((link: Link) => {
      useSynthesizer().removeLink(link.id);
    })
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