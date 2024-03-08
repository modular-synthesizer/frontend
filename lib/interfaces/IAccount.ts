import { Identifiable } from "./common/Identifiable";

export default interface IAccount extends Identifiable {
  username: string;
  password: string;
  password_confirmation: string;
  email: string;
}