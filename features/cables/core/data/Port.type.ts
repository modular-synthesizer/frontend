import type { ObjectId } from "../../../shared/data/ObjectId.type"

type PortBase = { id: ObjectId, moduleId: ObjectId, node: string, index: number }
export type OutputPort = PortBase & { kind: "output" }
export type InputPort = PortBase & { kind: "input" }
export type Port = OutputPort | InputPort