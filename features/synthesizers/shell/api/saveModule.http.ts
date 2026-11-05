import { ok, type Result } from "../../../shared/results/result";
import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { HttpError, HttpRequest } from "../../../shared/http/http";
import type { Placement } from "../../core/data/Placement.type";

type SaveModuleClosure = (id: ObjectId, placement: Placement) => Promise<Result<void, HttpError>>

type SaveModuleFct = (put: HttpRequest) => SaveModuleClosure

export const saveModule: SaveModuleFct = client => async (id, placement) => 
  client(`/proxy/modules/${id}`, placement)
    .then(response => response.flatMap(() => ok(undefined)))