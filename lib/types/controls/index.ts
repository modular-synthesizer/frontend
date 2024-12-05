import { ControlsPayload } from './ControlsPayload';
import { KnobPayload } from './KnobPayload';

export type ComponentNames = 'SmallKnob'|'Knob'|'LargeKnob'|'Port';

export const controlsPayloads: Record<ComponentNames, any> = {
    'LargeKnob': KnobPayload,
    'Knob': KnobPayload,
    'SmallKnob': KnobPayload,
    'Port': KnobPayload,
}

export {
    ControlsPayload, KnobPayload
}