import { describe, expect, it } from "vitest"
import { parseLink } from "../ApiLink.dto"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { ok } from "../../../../shared/results/result"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { CABLE_COLORS, DEFAULT_CABLE_COLOR } from "../../../core/shared/Constants"

describe("parseLink", () => {
  const valid = { id: "link", from: "out", to: "in", color: "blue" }

  it("accepts a complete link with typed identifiers", () => {
    expect(parseLink(deepFreeze(valid))).toEqual(ok({
      id: toObjectId("link"), from: toObjectId("out"), to: toObjectId("in"), color: "blue",
    }))
  })

  it("drops the extra fields", () => {
    const payload = deepFreeze({ ...valid, synthesizer_id: "synth", tab_id: "tab", tabId: "tab" })
    expect(parseLink(payload).orNull()).toEqual({
      id: toObjectId("link"), from: toObjectId("out"), to: toObjectId("in"), color: "blue",
    })
  })

  it.each([
    [ "null", null ],
    [ "a string", "link" ],
    [ "an array", [ "link", "out", "in" ] ],
  ])("refuses %s", (_, payload) => {
    expect(parseLink(payload).error()).toBe("link.invalid")
  })

  describe.each([ "id", "from", "to" ])("with the %s field", field => {
    it.each([
      [ "missing", undefined ],
      [ "empty", "" ],
      [ "not a string", 42 ],
    ])("refuses it when %s", (_, value) => {
      const payload = deepFreeze({ ...valid, [field]: value })
      expect(parseLink(payload).error()).toBe("link.invalid")
    })
  })

  describe("color", () => {
    it.each([ ...CABLE_COLORS ])("keeps the known color %s", color => {
      expect(parseLink(deepFreeze({ ...valid, color })).orNull()?.color).toBe(color)
    })
    it("replaces an unknown color with the default one", () => {
      expect(parseLink(deepFreeze({ ...valid, color: "purple" })).orNull()?.color).toBe(DEFAULT_CABLE_COLOR)
    })
    it("uses the default color when it is missing", () => {
      const { color: _, ...withoutColor } = valid
      expect(parseLink(deepFreeze(withoutColor)).orNull()?.color).toBe(DEFAULT_CABLE_COLOR)
    })
  })
})
