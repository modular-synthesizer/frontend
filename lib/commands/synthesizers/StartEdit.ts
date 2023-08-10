import { IControl } from "~~/lib/interfaces/IControl";
import SynthesizerCommand from "./SynthesizerCommand";

export default class SynthesizerStartEdit extends SynthesizerCommand {
  public runOnControl(control: IControl) {
    control.editing = true;
  }
}