import type { Identified } from "~/types/utils/Identified";

/**
 * A right represents the access to a given route on the API side, or the access to a given feature on the frontend
 * side. It is just wrapping a string label for the moment. It is then assigned to groups, through which users can
 * be granted the rights to use parts of the application.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export type Right = Identified & {
  label: string;
}