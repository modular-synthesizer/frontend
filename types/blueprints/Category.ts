import type { Identified } from "../utils/Identified";

export type Category = Identified & {
  // The name of the category, used in translation files.
  name: string;
}