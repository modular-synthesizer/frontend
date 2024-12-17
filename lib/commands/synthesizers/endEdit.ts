import type { Control } from "~/types/tools/Control";
import SynthesizerCommand from "./SynthesizerCommand";
import { setValue } from "~/utils/functions/parameters";

export default class SynthesizerEndEdit extends SynthesizerCommand {
  public override run() {
    super.run();
    if (this.parameter && this.payload.value) {
      setValue(this.parameter, this.payload.value)
    }
  }

  public override runOnControl(control: Control) {
    control.editing = false;
  }
}