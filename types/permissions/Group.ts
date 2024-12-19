import type { Identified } from "~/types/utils/Identified";
import type { Right } from "~/types/permissions/Right";

/**
 * A group is a set of users possessing certain rights throughout the application. Rights can be used server-side
 * or client-side, and the permission system MUST stay agnostic of that.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export type Group = Identified & {
  slug: string;
  scopes: Right[];
  is_default: boolean;
}