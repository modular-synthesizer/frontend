import Mod from '~~/lib/wrappers/Mod';

export default function(operation: string, mod: Mod): void {
  useWebsockets().send(JSON.stringify({
    resource: 'synthesizer',
    operation,
    synthesizer_id: useSynthesizerDetails().synthesizer.id,
    rack: mod.rack,
    slot: mod.slot,
    module_id: mod.id,
  }));
}