import { describe, expectTypeOf, it } from "vitest";
import { makeRunEffect } from "../effect";
import { del, put } from "../../../shared/http/nuxt.http";
import type { RunEffectFct } from "../../../shared/facts";
import type { CablesEffect } from "../../core/data/Effect.type";
import { toObjectId } from "../../../shared/data/ObjectId.type";
import { makeCableAudio } from "../audio/cable.audio";
import type { Connection } from "../../core/data/Cable.type";

describe("makeRunEffect", () => {
  const id = toObjectId("test")
  const moduleId = toObjectId("module.id")
  const ports = { del, put, audio: makeCableAudio(() => []) }
  const connection: Connection = {
    origin: { id, moduleId, node: "test", index: 0, kind: "output" },
    destination: { id, moduleId, node: "test", index: 0, kind: "input" }
  }

  it("builds the correct function type", () => {
    expectTypeOf(makeRunEffect(ports)).toEqualTypeOf<RunEffectFct<CablesEffect>>()
  })
  it("accepts the audio connection events", () => {
    expectTypeOf(makeRunEffect(ports)).toBeCallableWith({
      type: "cables.audio.connect", connection
    })
  })
  it("accepts the audio disconnection events", () => {
    expectTypeOf(makeRunEffect(ports)).toBeCallableWith({
      type: "cables.audio.disconnect", connection
    })
  })
  it("accepts the cable deletion events", () => {
    expectTypeOf(makeRunEffect(ports)).toBeCallableWith({
      type: "cables.cable.delete", id
    })
  })
  it("accepts the cable save events", () => {
    expectTypeOf(makeRunEffect(ports)).toBeCallableWith({
      type: "cables.cable.save", id, color: "green"
    })
  })
  it("refuses a save event with a color outside of CableColor", () => {
    expectTypeOf(makeRunEffect(ports)).toBeCallableWith({
      // @ts-expect-error "purple" is not a CableColor
      type: "cables.cable.save", id, color: "purple"
    })
  })
  it("refuses other unknown events", () => {
    expectTypeOf(makeRunEffect(ports)).toBeCallableWith({
      // @ts-expect-error blueprints.viewport.save
      type: "blueprints.viewport.save", id
    })
  })
})