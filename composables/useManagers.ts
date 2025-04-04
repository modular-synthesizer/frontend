import { values } from "lodash";
import type { IStartable, IStoppable } from "~/utils/interfaces/IManageable";
import { managers } from "~/utils/midi";

export function startManagers() {
  values(managers).forEach((m: IStartable) => m.start());
}

export function stopManagers() {
  values(managers).forEach((m: IStoppable) => m.stop());
}