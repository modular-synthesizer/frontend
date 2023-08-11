import ICategory from "~~/lib/interfaces/ICategory";
import ItemsList from "~~/lib/utils/ItemsList";

const lists = {
  categories: new ItemsList<ICategory>({ url: "/categories" })
}

export function useLists() {
  return lists;
}

export async function useCategoriesList() {
  return await ItemsList.build<ICategory>({ url: "/categories" })
}