import type { PlacedModule } from "~/types/modules/AudioModule";
import type { Control } from "~/types/tools/Control";

export const ControlsPayload = {
  mod: { type: Object as PropType<PlacedModule>, required: true },
  control: { type: Object as PropType<Control>, required: true },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
}