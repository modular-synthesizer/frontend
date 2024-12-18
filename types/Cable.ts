import type Port from "~/lib/wrappers/Port";

type CableDescription = {
  // The identifier of the connection, used to delete it.
  id: string;
  // The hexadecimal representation of the color for this cable.
  color: string;
}

/**
 * A cable links two ports in the synthesizer interface. It can be deleted by the user.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export type Cable = CableDescription & {
  // The origin port of the cable.
  from: Port;
  // The destination port of the cable.
  to: Port;
}

export type LinkPayload = CableDescription & {
  from: string;
  to: string;
}