import { Identifiable } from "../common/Identifiable";

export default interface IMembership extends Identifiable {
  username: string;
  account_id: string;
  type: string;
}