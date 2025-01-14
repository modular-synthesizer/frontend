import { ControlsPayload } from './ControlsPayload';
import { KnobPayload } from './KnobPayload';

export type ComponentNames = 'SmallKnob'|'Knob'|'LargeKnob'|'Oscilloscope'|'Port';

export const controlsPayloads: Record<ComponentNames, any> = {
    'LargeKnob': KnobPayload,
    'Knob': KnobPayload,
    'SmallKnob': KnobPayload,
    'Oscilloscope': KnobPayload,
    'Port': KnobPayload,
}

export {
    ControlsPayload, KnobPayload
}