import type { Identified } from "../utils/Identified";

export type Membership = Identified & {
  username: string;
  account_id: string;
  synthesizer_id: string;
  type: string;
}