import { find } from "lodash";
import ModulesFactory from "~~/lib/factories/ModulesFactory";
import { IGenerator } from "~~/lib/interfaces/IGenerator";
import ILink from "~~/lib/interfaces/ILink";
import IModule from "~~/lib/interfaces/IModule";
import ISynthesizer from "~~/lib/interfaces/ISynthesizer";
import { managers } from "~~/lib/managers";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import Link from "~~/lib/wrappers/Link";
import Mod from "~~/lib/wrappers/Mod";
import Synthesizer from "~~/lib/wrappers/Synthesizer";

export const modules: Ref<Mod[]> = ref([]);

export const links: Ref<Link[]> = ref([]);

export function useSynthesizerDetails() {

  /**
   * Fetches a synthesizer WITHOUT all the needed elements from it (modules, links, managers, etc.).
   * @param id the unique UUID of the synthesizer to get informations from.
   * @returns a synthesizer class object instanciated from the details got in the API.
   */
  async function fetch(id: string): Promise<Synthesizer> {
    const details: ISynthesizer = await api_get(`/synthesizers/${id}`);
    initializeManagers(details);
    return new Synthesizer(details);
  }

  async function initialize(synthesizer: Synthesizer) {
    await useAudioContext().initContext();
    await loadProcessors(useAudioContext().context as AudioContext);
    const [ generators, imodules, ilinks ] = await fetchChildren(synthesizer.id);
    await buildModules(imodules, synthesizer, generators);
    await buildLinks(ilinks);
  }

  async function fetchChildren(synthesizer_id: string): Promise<any> {
    return await Promise.all<[IModule[], ILink[]]>([
      api_get('/generators'),
      api_get('/modules', { synthesizer_id }),
      api_get('/links', { synthesizer_id })
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
    const { ports } = usePorts();
    list.filter((ilink: ILink) => {
      return find(ports, {id: ilink.from}) !== undefined
          && find(ports, {id: ilink.to}) !== undefined
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
    useAudioContext().context?.suspend();
  }

  function stopModules() {
    modules.value.forEach((m: Mod) => m.stop());
    modules.value = [];
  }

  return {
    fetch, initialize, stop, modules, links
  }
}