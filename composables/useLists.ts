import { buildList } from "~~/lib/utils/ItemsList";
import IApplication from "~~/lib/interfaces/IApplication";
import ICategory from "~~/lib/interfaces/ICategory";
import { IGenerator } from "~~/lib/interfaces/IGenerator";
import IGroup from "~~/lib/interfaces/permissions/IGroup";
import IRight from "~~/lib/interfaces/permissions/IRight";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import IAccount from "~~/lib/interfaces/IAccount";
import IMembership from "~~/lib/interfaces/synthesizers/IMembership";
import ISynthesizer from "~~/lib/interfaces/synthesizers/ISynthesizer";
import ITool from "~~/lib/interfaces/ITool";

const lists = {
  accounts: buildList<IAccount>({ url: "/accounts/search" }),
  applications: buildList<IApplication>({ url: '/applications', autofetch: false, }),
  categories: buildList<ICategory>({ url: "/categories" }),
  generators: buildList<IGenerator>({ url: "/generators" }),
  groups: buildList<IGroup>({ url: "/groups" }),
  rights: buildList<IRight>({ url: "/rights", autofetch: false, }),
  synthesizers: buildList<Synthesizer>({ url: "/synthesizers", useClass: Synthesizer }),
  tools: buildList<ITool>({ url: '/tools' }),
}

export function useLists() {
  return lists;
}

export function useMemberships(s: ISynthesizer): Promise<any> {
  return buildList<IMembership>({
    items: (new Synthesizer(s)).members,
    url: '/memberships',
  });
}