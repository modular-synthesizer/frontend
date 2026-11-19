import { toObjectId } from "../../../shared/data/ObjectId.type"
import { deleteSynthesizer, type DeleteSynthesizerFct } from "../api/deleteSynthesizer.http"
import { receiveDeletion } from "../../core/processes/receiveDeletion.process"

export type DeleteFromListFct = <T extends { id: string }>(list: { value: T[] }, id: string) => Promise<void>

export const makeDeleteFromList = (remove: DeleteSynthesizerFct): DeleteFromListFct => async (list, id) => {
  const response = await remove(toObjectId(id))
  list.value = receiveDeletion(list.value, id, response)
}

export const deleteFromList = makeDeleteFromList(deleteSynthesizer)
