import { values } from "lodash";
import type { IStartable, IStoppable } from "~/utils/interfaces/IManageable";
import { managers } from "~~/lib/managers";

export function startManagers() {
  values(managers).forEach((m: IStartable) => m.start());
}

export function stopManagers() {
  values(managers).forEach((m: IStoppable) => m.stop());
}