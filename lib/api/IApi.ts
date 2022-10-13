import { tsConstructorType } from "@babel/types"

export default interface IApi {
  /**
   * Makes a GET request on the API on the given URL, passing the given parameters
   * as querystring parameters along the way. Subclasses MUST get the session token
   * from any source and set it in the querystring along the call so that the API
   * recognizes it on authenticated routes.
   * 
   * @param uri The absolute URI you're trying to reach on the API, with the leading /.
   * @param payload the parameters you want to pass to the route on the API as a hash.
   */
  get (uri: string, payload?: any): Promise<any>

  post(uri: string, payload?: any): Promise<any>

  delete(uri: string, payload?: any): Promise<any>
}