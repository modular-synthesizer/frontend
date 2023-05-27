import { values } from "lodash";
import IManager from "~~/lib/interfaces/IManager";
import { managers } from "~~/lib/managers";

export function startManagers() {
  values(managers).forEach((m: IManager) => m.start());
}

export function stopManagers() {
  values(managers).forEach((m: IManager) => m.stop());
}