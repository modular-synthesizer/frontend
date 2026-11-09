import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { MidiChannel } from "./MidiMessage.type";

export type BindingKey = `${MidiChannel}:${number}`

export type Bindings = Record<BindingKey, ObjectId[]>

export type Learning = { pending: ObjectId | null, bindings: Bindings }