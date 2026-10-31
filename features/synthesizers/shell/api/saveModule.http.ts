import { ok, type Result } from "../../../shared/results/result";
import type { Uuid } from "../../../shared/data/Uuid.type";
import type { HttpError, HttpPut } from "../../../shared/http/http";
import type { Placement } from "../../core/data/Placement.type";

type SaveModuleClosure = (id: Uuid, placement: Placement) => Promise<Result<void, HttpError>>

type SaveModuleFct = (put: HttpPut) => SaveModuleClosure

export const saveModule: SaveModuleFct = client => async (id, placement) => 
  client(`/proxy/modules/${id}`, placement)
    .then(response => response.flatMap(() => ok(undefined)))