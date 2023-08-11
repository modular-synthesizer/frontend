import ICategory from "~~/lib/interfaces/ICategory";
import { buildList } from "~~/lib/utils/ItemsList";

const lists = {
  categories: buildList<ICategory>({ url: "/categories" }),
  groups: buildList<IGroup>({ url: "/groups" }),
}

export function useLists() {
  return lists;
}