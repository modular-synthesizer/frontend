import type { Control } from "~/types/tools/Control";
import SynthesizerCommand from "./SynthesizerCommand";

export default class SynthesizerStartEdit extends SynthesizerCommand {
  public override runOnControl(control: Control) {
    control.editing = true;
  }
}