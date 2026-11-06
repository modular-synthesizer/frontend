import { describe, expect, it } from "vitest";
import type { Session } from "../../../../core/data/Session.type";
import { toObjectId } from "../../../../../shared/data/ObjectId.type";
import { toLegacySession } from "../session.mapper";

describe("toLegacySession", () => {
  const account = { username: "test_username", email: "test@mail.com", id: toObjectId("test") }
  const session: Session = { admin: true, rights: [], token: "test.token", account }

  it("correctly translates a session into the legacy type", () => {
    expect(toLegacySession(session)).toEqual({
      id: "",
      token: "test.token",
      rights: [],
      admin: true,
      account: { id: "test", username: "test_username", email: "test@mail.com" }
    })
  })
  it("translates a non admin session into the legacy type", () => {
    const acc = {  username: "test_nonadmin", email: "nonadmin@mail.com", id: toObjectId("other") }
    const nonAdmin = { ...session, token: "other.token", admin: false, account: acc }

    expect(toLegacySession(nonAdmin)).toEqual({
      id: "",
      token: "other.token",
      rights: [],
      admin: false,
      account: { id: "other", username: "test_nonadmin", email: "nonadmin@mail.com" }
    })
  })
  it("translates the rights as legacy rights", () => {
    const acc = { ...account, username: "test_rights", email: "rights@mail.com" }
    const withRights: Session = { ...session, rights: [ "test.right", "other.right" ], account: acc }

    expect(toLegacySession(withRights)).toEqual({
      id: "",
      token: "test.token",
      rights: [ { id: "", label: "test.right" }, { id: "", label: "other.right" }],
      admin: true,
      account: { id: "test", username: "test_rights", email: "rights@mail.com" }
    })
  })
})
