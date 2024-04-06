import { find, isEqual } from "lodash";
import { api } from "~~/lib/api/Api";

type Parameters = { [key: string]: any }

type Memoized = { url: string, params: Parameters, results: any }
type Memoizer = Memoized[]

export default function useMemoization() {

  const memo: Memoizer = [];

  async function query(url: string, params: Parameters = {} ): Promise<any> {
    const found: Memoized|undefined = find(memo, (item: Memoized) => {
      
      console.log(url, params, item);
      return url === item.url && isEqual(item.params, params)
    });
    if (found) {
      console.log("a memo has been found !")
      return new Promise((resolve: Function) => resolve(found.results));
    }
    else {
      console.log("a query has been made without memoization");
      return api.auth_get(url, params).then((results: any) => {
        memo.push({ url, params, results });
        return results;
      });
    }
  }
  return { query }
}