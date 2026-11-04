import type { Mapper } from "../types/mapper.type"

export type ObjectId = string & { _brand: 'ObjectId' }

export const toObjectId: Mapper<string, ObjectId> = raw =>  raw as ObjectId

export const toEventualObjectId: Mapper<string, ObjectId | null> = raw =>
  raw === "" ? null : toObjectId(raw)