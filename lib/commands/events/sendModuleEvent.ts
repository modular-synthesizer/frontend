import Mod from '~~/lib/wrappers/Mod';
import sendEvent from './sendEvent';

export default function(operation: string, mod: Mod): void {
  sendEvent({
    resource: 'synthesizer',
    operation,
    synthesizer_id: useSynthesizerDetails().synthesizer.id,
    rack: mod.rack,
    slot: mod.slot,
    module_id: mod.id,
  })
}