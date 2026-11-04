import type { Parameter as LegacyParameter } from "~/types/modules/Parameter";
import { receiveParameter } from "../../core/processes/editParameter.process";
import { applyValue } from "./parameter.adapter";

type ReceiveParameterAdapter = (legacy: LegacyParameter, payload: { value: number, t: number | string}) => void

export const receiveParameterAdapter: ReceiveParameterAdapter = (legacy, payload) => {
  const { value, t } = receiveParameter(legacy, { ...payload, t: Number.parseInt(`${payload.t}`) })
  applyValue(legacy, value)
  legacy.t = t
}
