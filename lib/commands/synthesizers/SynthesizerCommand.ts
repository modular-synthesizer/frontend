import Command from "../Command";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import type { Parameter } from '~/types/modules/Parameter';
import { getControls } from "~/utils/functions/parameters";
import type { Control } from "~/types/tools/Control";
import type { AudioModule } from "~/types/modules/AudioModule";

export interface ControlEditPayload {
  module_id: string;
  parameter_id: string;
  synthesizer_id: string;
  value?: number;
}

export default abstract class SynthesizerCommand extends Command<ControlEditPayload> {

  protected extractModule(): AudioModule|undefined {
    const synth: Synthesizer = useSynthesizer().synthesizer.value;
    if (!synth || synth?.id !== this.payload.synthesizer_id) return;
    return useSynthesizer().modules.value.find(m => m.id === this.payload.module_id) as AudioModule;
  }

  protected extractParameter(): Parameter|undefined {
    const mod: AudioModule|undefined = this.extractModule();
    if (!mod) return;
    return Object.values(mod.parameters).find(p => p.id === this.payload.parameter_id);
  }

  public override validate(): boolean {
    return this.required("module_id", "parameter_id", "synthesizer_id");
  }

  public run() {
    const parameter: Parameter|undefined = this.extractParameter();
    if (!!parameter) {
      getControls(parameter).forEach(c => this.runOnControl(c));
    }
  }

  public get parameter(): Parameter|undefined {
    return this.extractParameter();
  }

  public runOnControl(control: Control): void {}
}