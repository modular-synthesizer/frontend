import type { Identified } from "../utils/Identified";

export type ComponentNames = 'SmallKnob' | 'Knob' | 'LargeKnob' | 'Port';

export type Control = Identified & {
  // The component name, used to instanciate it in the dynamic component wrapper.
  component: ComponentNames;
  // The payload containing all informations regarding the control.
  payload: Record<string, string|number>;
}