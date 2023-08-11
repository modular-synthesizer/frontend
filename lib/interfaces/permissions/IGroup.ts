import IRight from "./IRight";

/**
 * A group is a set of users possessing certain rights throughout the application. Rights can be used server-side
 * or client-side, and the permission system MUST stay agnostic of that.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default interface IGroup {
  id: string;
  slug: string;
  rights: IRight[];
  is_default: boolean;
}