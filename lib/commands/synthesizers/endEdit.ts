import { IControl } from "~~/lib/interfaces/IControl";
import SynthesizerCommand from "./SynthesizerCommand";

export default class SynthesizerEndEdit extends SynthesizerCommand {
  // This finds the module, then the control, and marks it as "editing"
  public run() {
    const control: IControl|undefined = this.extractControl();
    if (!!control) control.editing = false;
  }
}