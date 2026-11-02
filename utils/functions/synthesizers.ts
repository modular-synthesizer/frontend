import type { Synthesizer } from "~/types/synthesizers/Synthesizer";
import type { Membership } from "~/types/synthesizers/Membership";

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