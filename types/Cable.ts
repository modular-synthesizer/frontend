import type Port from "~/lib/wrappers/Port";

/**
 * A cable links two ports in the synthesizer interface. It can be deleted by the user.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export type Cable = {
  // The identifier of the connection, used to delete it.
  id: string;
  // The origin port of the cable.
  from: Port;
  // The destination port of the cable.
  to: Port;
  // The hexadecimal representation of the color for this cable.
  color: string;
}