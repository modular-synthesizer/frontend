import { IControl } from "~~/lib/interfaces/IControl";
import SynthesizerCommand from "./SynthesizerCommand";

export default class SynthesizerEndEdit extends SynthesizerCommand {
  public run() {
    super.run();
    if (this.parameter && this.payload.value) {
      this.parameter.setValue(this.payload.value);
    }
  }

  public runOnControl(control: IControl) {
    control.editing = false;
  }
}