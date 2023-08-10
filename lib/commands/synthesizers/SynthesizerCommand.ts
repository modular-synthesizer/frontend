import { IControl } from "~~/lib/interfaces/IControl";
import Command from "../Command";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import Mod from "~~/lib/wrappers/Mod";

export interface ControlEditPayload {
  module_id: string;
  control_id: string;
  synthesizer_id: string;
}

export default abstract class SynthesizerCommand extends Command<ControlEditPayload> {
  extractControl(): IControl|undefined {
    const synth: Synthesizer = useSynthesizerDetails().synthesizer as Synthesizer;
    if (!synth || synth?.id !== this.payload.synthesizer_id) return;
    const mod: Mod|undefined = useModulesList().modules.find(m => m.id === this.payload.module_id) as Mod;
    if (!mod) return;
    const control: IControl|undefined = mod.controls.find(c => c.id === this.payload.control_id);
    return control;
  }

  public validate(): boolean {
    return this.required("module_id", "control_id", "synthesizer_id");
  }
}