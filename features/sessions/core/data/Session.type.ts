import type { ObjectId } from "../../../shared/data/ObjectId.type"

export type Session = {
  token: string
  admin: boolean
  rights: string[]
  account: { id: ObjectId, username: string, email: string }
}