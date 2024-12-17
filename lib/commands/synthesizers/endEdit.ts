import { IControl } from "~~/lib/interfaces/IControl";
import SynthesizerCommand from "./SynthesizerCommand";
import { setValue } from "~/utils/functions/parameters";

export default class SynthesizerEndEdit extends SynthesizerCommand {
  public run() {
    super.run();
    if (this.parameter && this.payload.value) {
      setValue(this.parameter, this.payload.value)
    }
  }

  public runOnControl(control: IControl) {
    control.editing = false;
  }
}