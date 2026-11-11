import type { Connection } from "./Cable.type";
import type { Port } from "./Port.type";

/**
 * This type models the different possible states a cable creation can be in :
 * - idle means "not currently happening", no cable is currently being created.
 * - started means that a cable has been dragged from a port, but is not magnetized to another port.
 * - magnetized means that the cable has been created and magnetized to another port.
 */
export type CableDrag =
  | { step: "idle" }
  | { step: "started", origin: Port }
  | { step: "magnetized", origin: Port, target: Port, connection: Connection }