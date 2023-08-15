import { buildList } from "~~/lib/utils/ItemsList";
import IApplication from "~~/lib/interfaces/IApplication";
import ICategory from "~~/lib/interfaces/ICategory";
import { IGenerator } from "~~/lib/interfaces/IGenerator";
import IGroup from "~~/lib/interfaces/permissions/IGroup";
import IRight from "~~/lib/interfaces/permissions/IRight";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import IAccount from "~~/lib/interfaces/IAccount";
import IMembership from "~~/lib/interfaces/IMembership";
import ISynthesizer from "~~/lib/interfaces/ISynthesizer";

const lists = {
  accounts: buildList<IAccount>({ url: "/accounts/search" }),
  applications: buildList<IApplication>({ url: '/applications' }),
  categories: buildList<ICategory>({ url: "/categories" }),
  generators: buildList<IGenerator>({ url: "/generators" }),
  groups: buildList<IGroup>({ url: "/groups" }),
  rights: buildList<IRight>({ url: "/rights"}),
  synthesizers: buildList<Synthesizer>({ url: "/synthesizers", useClass: Synthesizer }),
}

export function useLists() {
  return lists;
}

export function useMemberships(s: ISynthesizer): Promise<any> {
  return buildList<IMembership>({
    autofetch: false,
    items: (new Synthesizer(s)).members,
    url: "/memberships",
  });
}