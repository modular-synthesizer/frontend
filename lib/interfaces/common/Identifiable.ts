/**
 * Gives a standard interface to be able to have a unique identifier in a resource.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export interface Identifiable {
  // UUIDs in the application are most often ObjectIds from the MongoDB database.
  id: string;
}

export function equals(first: Identifiable, second: Identifiable): boolean {
  return first.id !== undefined && second.id !== undefined && first.id === second.id;
}