import { ok, type Result } from "../../../shared/results/result";
import type { Uuid } from "../../../shared/data/Uuid.type";
import type { HttpError, HttpPut } from "../../../shared/http/http";

type SaveParameterClosure = (id: Uuid, moduleId: Uuid, value: number, t: number) => Promise<Result<void, HttpError>>

type SaveParameterFct = (put: HttpPut) => SaveParameterClosure

export const saveParameter: SaveParameterFct = client => async (id, moduleId, value, t) => 
  client(`/proxy/parameters/${id}`, { value, t, module_id: moduleId })
    .then(response => response.flatMap(() => ok(undefined)))
