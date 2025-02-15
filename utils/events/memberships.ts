import type { Synthesizer } from "~/types/Index";
import type { Membership } from "~/types/synthesizers/Membership";
import { sendMessage } from "~/utils/functions/websockets"

export function membershipCreatedEvent(synthesizer: Synthesizer, membership: Membership) {
  sendMessage({
    resource: 'synthesizer',
    operation: 'membershipCreated',
    membership,
    synthesizer_id: synthesizer.id,
  });
}

export function membershipDeletedEvent(synthesizer: Synthesizer, membership: Membership) {
  sendMessage({
    resource: 'synthesizer',
    operation: 'membershipDeleted',
    membership,
    synthesizer_id: synthesizer.id,
  });
}