import { clamp } from "lodash";
import type { Channel } from "~/types/modules/Channel";
import type { Parameter } from "~/types/modules/Parameter";
import type { Control } from "~/types/tools/Control";
import type { Parameters, PlacedModule } from "~/types/modules/AudioModule";

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

/**
 * Moves the value of a parameter from a relative delta instead of setting it to an absolute new value.
 * @param param the parameter to modify the value of.
 * @param delta the delta to move it of, as the difference between current value, and new expected value.
 */
export function moveValue(param: Parameter, delta: number): void {
  setValue(param, param.value + delta);
}

/**
 * Gets all the controls directly targetting the parameter, ie able to modify its value.
 * @param param the parameter the returned controls are able to modify.
 * @returns an array of controls targetting this parameter.
 */
export function getControls(param: Parameter): Array<Control> {
  return param.mod.controls.filter((c: Control) => c.payload.target === param.name);
}

export function extractAudioParam(node: AudioNode, field: string): AudioParam|undefined {
  if (node instanceof AudioWorkletNode) return node.parameters.get(field);
  return node[field as keyof AudioNode] as unknown as AudioParam;
}

export function initParameters(module: PlacedModule, parameters: Array<Parameter>): Parameters {
  parameters.forEach((p: Parameter) => {
    p.mod = module;
    setValue(p, p.value);
  })
  return Object.fromEntries(parameters.map((p: Parameter) => [p.name, p]))
}