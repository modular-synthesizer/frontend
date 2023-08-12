import Mod from '~~/lib/wrappers/Mod';

export default function(operation: string, mod: Mod): void {
  const payload = {
    resource: 'synthesizer',
    operation,
    synthesizer_id: useSynthesizerDetails().synthesizer.id,
    rack: mod.rack,
    slot: mod.slot,
    module_id: mod.id,
  }
  console.log(payload);
  useWebsockets().send(JSON.stringify(payload));
}