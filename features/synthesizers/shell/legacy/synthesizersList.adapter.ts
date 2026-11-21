import { toObjectId } from "../../../shared/data/ObjectId.type"
import { deleteSynthesizer, type DeleteSynthesizerFct } from "../api/deleteSynthesizer.http"
import { receiveDeletion } from "../../core/processes/receiveDeletion.process"
import type { ListStatus } from "../../core/data/ListStatus.type"
import { receiveList } from "../../core/processes/receiveList.process"
import { type ListSynthesizersFct, listSynthesizers } from "../api/listSynthesizers.http"
import type { ApiSynthesizer } from "../dto/ApiSynthesizer.dto"

export type DeleteFromListFct = <T extends { id: string }>(list: { value: T[] }, id: string) => Promise<void>

export const makeDeleteFromList = (remove: DeleteSynthesizerFct): DeleteFromListFct => async (list, id) => {
  const response = await remove(toObjectId(id))
  list.value = receiveDeletion(list.value, id, response)
}

export const deleteFromList = makeDeleteFromList(deleteSynthesizer)

export type LoadListFct = (list: { value: ApiSynthesizer[] }, status: { value: ListStatus }) => Promise<void>

export const makeLoadList = (fetch: ListSynthesizersFct): LoadListFct => async (list, status) => {
  status.value = "loading"
  const response = await fetch()
  const received = receiveList(list.value, response)
  list.value = received.items
  status.value = received.status
}

export const loadList = makeLoadList(listSynthesizers)