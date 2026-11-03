import { describe, expect, it } from "vitest";
import type { Parameter, ParameterChange } from "../../data/Parameter.type";
import type { Uuid } from "../../../../shared/data/Uuid.type";
import { clampValue, targetValue, valuesDiffer } from "../parameter";

const parameter: Parameter = {
  id: "id" as Uuid, moduleId: "m_id" as Uuid, minimum: 0, maximum: 100, step: 1, value: 50, default: 1
}

describe("clampValue", () => {
  it("keeps the same value if it's strictly between min and max", () => {
    expect(clampValue(parameter, 55)).toEqual(55)
  })
  it("clamps down the value if it's above the maximum", () => {
    expect(clampValue(parameter, 200)).toEqual(100)
  })
  it("clamps up the value if it's below the minimum", () => {
    expect(clampValue(parameter, -1)).toEqual(0)
  })
  it("keeps the same value if it's exactly the maximum", () => {
    expect(clampValue(parameter, 100)).toEqual(100)
  })
  it("keeps the same value if it's exactly the minimum", () => {
    expect(clampValue(parameter, 0)).toEqual(0)
  })
})

describe("targetValue", () => {
  describe("drag events", () => {
    it("returns the correct value when dragged downward", () => {
      const change: ParameterChange = { kind: "drag", pixels: -25 }
      expect(targetValue(parameter, change)).toEqual(48)
    })
    it("returns the correct value when dragged upward", () => {
      const change: ParameterChange = { kind: "drag", pixels: 25 }
      expect(targetValue(parameter, change)).toEqual(53)
    })
    it("rounds the value for two little drag", () => {
      const change: ParameterChange = { kind: "drag", pixels: 4 }
      expect(targetValue(parameter, change)).toEqual(50)
    })
  })
  describe("wheel event", () => {
    it("works when wheeling up", () => {
      const change: ParameterChange = { kind: "wheel", deltaY: -1, shift: false }
      expect(targetValue(parameter, change)).toEqual(51)
    })
    it("works when wheeling down", () => {
      const change: ParameterChange = { kind: "wheel", deltaY: 1, shift: false }
      expect(targetValue(parameter, change)).toEqual(49)
    })
    it("changes the value more with the shift", () => {
      const change: ParameterChange = { kind: "wheel", deltaY: -1, shift: true }
      expect(targetValue(parameter, change)).toEqual(60)
    })
    it("does not change anything when deltaY is zero", () => {
      const change: ParameterChange = { kind: "wheel", deltaY: 0, shift: false }
      expect(targetValue(parameter, change)).toEqual(50)
    })
  })
  describe("midi event", () => {
    it("returns the minimum when the MIDI message value is 0", () => {
      const change: ParameterChange = { kind: "midi", amount: 0 }
      expect(targetValue(parameter, change)).toEqual(0)
    })
    it("returns the maximum when the MIDI message value is 127", () => {
      const change: ParameterChange = { kind: "midi", amount: 127 }
      expect(targetValue(parameter, change)).toEqual(100)
    })
    it("rounds any intermediary value down if needed", () => {
      const change: ParameterChange = { kind: "midi", amount: 42 }
      expect(targetValue(parameter, change)).toEqual(33)
    })
    it("rounds any intermediary value up if needed", () => {
      const change: ParameterChange = { kind: "midi", amount: 44 }
      expect(targetValue(parameter, change)).toEqual(35)
    })
  })
  describe("reset event", () => {
    it("returns the default value for the parameter", () => {
      expect(targetValue(parameter, { kind: "reset" })).toEqual(1)
    })
    it("returns the default value for any other value", () => {
      expect(targetValue({ ...parameter, value: 42 }, { kind: "reset" })).toEqual(1)
    })
  })
})

describe("valuesDiffer", () => {
  it("returns TRUE if both values differ", () => {
    expect(valuesDiffer(10, 20)).toEqual(true)
  })
  it("returns FALSE if both values are identical", () => {
    expect(valuesDiffer(10, 10)).toEqual(false)
  })
})