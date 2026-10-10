import { vi } from "vitest";

export function mockAudioNode(): AudioNode {
  return { connect: vi.fn(), disconnect: vi.fn() } as unknown as AudioNode
}