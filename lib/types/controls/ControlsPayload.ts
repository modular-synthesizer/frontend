import { IControl } from "~~/lib/interfaces/IControl";
import Mod from "~~/lib/wrappers/Mod";

export const ControlsPayload = {
  mod: { type: Mod, required: true },
  control: { type: Object as PropType<IControl>, required: true },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
}