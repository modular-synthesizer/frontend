import type { PlacedModule } from '~/types/modules/AudioModule';
import sendEvent from './sendEvent';

export default function(operation: string, mod: PlacedModule): void {
  sendEvent({
    resource: 'synthesizer',
    operation,
    synthesizer_id: useSynthesizer().synthesizer.value.id,
    rack: mod.rack,
    slot: mod.slot,
    module_id: mod.id,
  })
}