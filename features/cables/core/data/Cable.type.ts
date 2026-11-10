import type { ObjectId } from "../../../shared/data/ObjectId.type"
import type { InputPort, OutputPort } from "./Port.type"

export type CableColor = "red" | "blue" | "green" | "yellow"

export type Connection = { origin: OutputPort, destination: InputPort }

export type Cable = Connection & { id: ObjectId | null, color: CableColor }

export type SavedCable = Cable & { id: ObjectId }