import type { Mapper } from "~/features/synthesizers/core/shared/rack"

export type ObjectId = string & { _brand: 'ObjectId' }

export const toObjectId: Mapper<string, ObjectId> = raw =>  raw as ObjectId

export const toEventualObjectId: Mapper<string, ObjectId | null> = raw =>
  raw === "" ? null : toObjectId(raw)