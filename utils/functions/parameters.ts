import { clamp } from "lodash";
import type { Channel } from "~/types/modules/Channel";
import type { Parameter } from "~/types/modules/Parameter";
import type { Parameters, AudioModule } from "~/types/modules/AudioModule";

/**
 * Sets a new value in a parameter, and its corresponding Web Audio API AudioParam object.
 * The value will be clamped with the minimum and maximum bounds, but NOT rounded with step or precision.
 * 
 * @param param The parameter object in which the value should be set.
 * @param value The new value to attribute to this parameter.
 */
export function setValue(param: Parameter, value: number): void {
  param.value = clamp(value, param.minimum, param.maximum);
  param.targets.forEach((target: string) => {
    param.mod.channels.forEach((channel: Channel) => {
      const audioParam: AudioParam|undefined = extractAudioParam(channel.nodes[target], param.field);
      if (audioParam === undefined) return;
      audioParam.setValueAtTime(param.value, useAudio().context.currentTime);
    })
  })
}

export function extractAudioParam(node: AudioNode, field: string): AudioParam|undefined {
  if (node instanceof AudioWorkletNode) return node?.parameters.get(field);
  if (node === undefined) return;
  return node[field as keyof AudioNode] as unknown as AudioParam;
}

export function initParameters(module: AudioModule, parameters: Array<Parameter>): Parameters {
  parameters.forEach((p: Parameter) => {
    p.mod = module;
    setValue(p, p.value);
  })
  return Object.fromEntries(parameters.map((p: Parameter) => {
    const t: number = parseInt(`${p.t}`);
    return [p.name, { ...p, t }]
  }))
}