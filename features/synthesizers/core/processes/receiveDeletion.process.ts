import type { HttpError } from "~/features/shared/http/http";
import type { Result } from "~/features/shared/results/result";

export type ReceiveDeletionFct = <T extends { id: string }>(
  list: T[],
  id: string,
  response: Result<void, HttpError>
) => T[]

export const receiveDeletion: ReceiveDeletionFct = (list, id, response) => {
  return response.ok ? list.filter(s => s.id !== id) : [ ...list ]
}