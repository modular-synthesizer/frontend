import type { Result } from "../../../shared/results/result";
import type { ListStatus } from "../data/ListStatus.type";
import type { HttpError } from "../../../shared/http/http";

export type ReceivedList<T> = { items: T[], status: Exclude<ListStatus, "loading"> }

export type ReceiveListFct = <T extends { id: string }>(
  current: T[],
  response: Result<T[], HttpError>,
) => ReceivedList<T>

export const receiveList: ReceiveListFct = (current, response) => {
  if (response.ok) {
    const items = response.orNull()
    return {
      status: "loaded",
      items: [ ...items, ...current.filter(s => !items.find(i => i.id === s.id)) ]
    }
  }
  return { status: "failed", items: [ ...current ] }
}
