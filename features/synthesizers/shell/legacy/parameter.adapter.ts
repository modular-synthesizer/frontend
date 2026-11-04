import type { Parameter as LegacyParameter } from "~/types/modules/Parameter";
import type { Mapper } from "../../core/shared/rack";
import type { Parameter, ParameterChange } from "../../core/data/Parameter.type";
import { toEventualObjectId, toObjectId } from "../../../shared/data/ObjectId.type";
import { setValue } from "../../../../utils/functions/parameters"
import { editParameter as editProcess, previewParameter } from "../../core/processes/editParameter.process";
import type { SynthesizersEffect } from "../../core/data/Effect.type";
import type { RunEffectFct } from "../../../shared/facts";
import { debouncedRunEffect, runEffect } from "../effect";

export const toParameter: Mapper<LegacyParameter, Parameter> = legacy => ({
  id: toObjectId(legacy.id),
  moduleId: toEventualObjectId(legacy.mod.id),
  value: legacy.value,
  default: legacy.default,
  minimum: legacy.minimum,
  maximum: legacy.maximum,
  step: legacy.step,
})

export type ApplyValueFct = (legacy: LegacyParameter, value: number) => void

export const applyValue: ApplyValueFct = (legacy, value) => setValue(legacy, value)

export type PreviewParameterAdapter = (legacy: LegacyParameter, change: ParameterChange, from: number) => void

export const previewParameterAdapter: PreviewParameterAdapter = (legacy, change, from) =>
  applyValue(legacy, previewParameter({ ...toParameter(legacy), value: from }, change))

export type EditParameterAdapter = (legacy: LegacyParameter, change: ParameterChange, from?: number) => Promise<void>

export type EditParameterFactory = (run: RunEffectFct<SynthesizersEffect>, timer: () => number) => EditParameterAdapter

export const makeEditParameter: EditParameterFactory = (run, timer) => async (legacy, change, from = legacy.value) => {
  const time: number = timer()
  const { value, effects } = editProcess({ ...toParameter(legacy), value: from }, change, time)
  applyValue(legacy, value)
  if (effects.length) legacy.t = time
  await Promise.all(effects.map(run))
}

export const editParameter = makeEditParameter(runEffect, Date.now)

export const editParameterDebounced = makeEditParameter(debouncedRunEffect, Date.now)
