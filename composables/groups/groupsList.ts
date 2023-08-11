import ItemsList from "~~/lib/utils/ItemsList";
import IGroup from "~~/lib/interfaces/permissions/IGroup";

const list = new ItemsList<IGroup>({ url: "/groups", autofetch: true });

export function groupsList() {
  return list;
}