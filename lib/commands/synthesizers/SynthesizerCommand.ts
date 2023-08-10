import { IControl } from "~~/lib/interfaces/IControl";
import Command from "../Command";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import Mod from "~~/lib/wrappers/Mod";
import Parameter from "~~/lib/wrappers/Parameter";

export interface ControlEditPayload {
  module_id: string;
  parameter_id: string;
  synthesizer_id: string;
  value?: number;
}

export default abstract class SynthesizerCommand extends Command<ControlEditPayload> {
  protected extractParameter(): Parameter|undefined {
    const synth: Synthesizer = useSynthesizerDetails().synthesizer as Synthesizer;
    if (!synth || synth?.id !== this.payload.synthesizer_id) return;
    const mod: Mod|undefined = useModulesList().modules.find(m => m.id === this.payload.module_id) as Mod;
    if (!mod) return;
    return mod.parameters.find(p => p.id === this.payload.parameter_id);
  }

  public validate(): boolean {
    return this.required("module_id", "parameter_id", "synthesizer_id");
  }

  public run() {
    const parameter: Parameter|undefined = this.extractParameter();
    if (!!parameter) {
      parameter.controls.forEach(c => this.runOnControl(c));
    }
  }

  public get parameter(): Parameter|undefined {
    return this.extractParameter();
  }

  public abstract runOnControl(control: IControl): void;
}