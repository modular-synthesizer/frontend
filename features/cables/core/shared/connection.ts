import { ko, ok, type Result } from "../../../shared/results/result"
import type { Connection } from "../data/Cable.type"
import type { OutputPort, Port } from "../data/Port.type"
import type { ObjectId } from "../../../shared/data/ObjectId.type"

export type IsOutputFct = (port: Port) => port is OutputPort

export type OrientError = "cable.kinds.identical"

export type OrientFct = (first: Port, second: Port) => Result<Connection, OrientError>

export type SameConnectionFct = (first: Connection, second: Connection) => boolean

export type AcceptsFct = (cables: readonly Connection[], port: Port) => boolean

export type TouchesFct = (connection: Connection, moduleId: ObjectId) => boolean

export const isOutput: IsOutputFct = port => (port.kind === "output")

export const orient: OrientFct = (first, second) => {
  if (isOutput(first) && !isOutput(second)) return ok({ origin: first, destination: second })
  if (isOutput(second) && !isOutput(first)) return ok({ origin: second, destination: first })
  return ko("cable.kinds.identical")
}

export const accepts: AcceptsFct = (cables, { id }) => {
  for (const { origin, destination } of cables) {
    if (origin.id === id || destination.id === id) return false
  }
  return true
}

export const sameConnection: SameConnectionFct = ({ origin, destination }, other) =>
  origin.id === other.origin.id && destination.id === other.destination.id


export const touches: TouchesFct = ({ origin, destination }, moduleId) =>
  origin.moduleId === moduleId || destination.moduleId === moduleId