import { some } from "lodash";
import type { AudioModule, ModuleCoordinates } from "~/types/modules/AudioModule";
import { intersect } from "./modules";
import type { Synthesizer } from "~/types/synthesizers/Synthesizer";
import type { Membership } from "~/types/synthesizers/Membership";
import { repositories } from "~/lib/repositories";

export function hasRoom(synthesizer: Synthesizer, coordinates: ModuleCoordinates): boolean {
  return !some(synthesizer.modules, (module: AudioModule) => intersect(module, coordinates));
}

export function firstFreeSlot(synthesizer: Synthesizer, slots: number) {
  let slot = 0;
  while(!hasRoom(synthesizer, { rack: 0, slot, slots, id: '' })) slot ++;
  return slot;
}

export function isReadMember(synthesizer: Synthesizer, username: string): boolean {
  return membershipType(synthesizer, username) === 'read';
}

export function isWriteMember(synthesizer: Synthesizer, username: string): boolean {
  return membershipType(synthesizer, username) === 'write';
}

export function isCreatorMember(synthesizer: Synthesizer, username: string): boolean {
  return membershipType(synthesizer, username) === 'creator';
}

export function membershipType(synthesizer: Synthesizer, username: string): string {
  return synthesizer.members.find((m: Membership) => m.username === username)?.type || "read";
}

export async function reset(synthesizer: Synthesizer) {
  synthesizer.x = 0;
  synthesizer.y = 0;
  synthesizer.scale = 1.0;
  await repositories.synthesizers.update(synthesizer);
}