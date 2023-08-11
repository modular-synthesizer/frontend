import { buildList } from "~~/lib/utils/ItemsList";
import IApplication from "~~/lib/interfaces/IApplication";
import ICategory from "~~/lib/interfaces/ICategory";
import { IGenerator } from "~~/lib/interfaces/IGenerator";
import IGroup from "~~/lib/interfaces/permissions/IGroup";
import IRight from "~~/lib/interfaces/permissions/IRight";

const lists = {
  applications: buildList<IApplication>({ url: '/applications' }),
  categories: buildList<ICategory>({ url: "/categories" }),
  generators: buildList<IGenerator>({ url: "/generators" }),
  groups: buildList<IGroup>({ url: "/groups" }),
  rights: buildList<IRight>({ url: "/rights"}),
}

export function useLists() {
  return lists;
}