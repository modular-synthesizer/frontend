import axios from "axios";
import { useTab } from "./usetab";

type HttpMethod = 'get'|'post'|'put'|'delete';

/**
 * Makes a GET request on the API, usually to gather informations about a list of elements, or an element.
 * @param uri the URI to get the item from on the API (drop the proxy prefix from the frontend).
 * @param payload all parameters passed as querystring in the URL if necessary (for example pagination in a list)
 * @returns a promise to be waited on, containing the results returned in the body of the response.
 */
export async function api_get(uri: string, payload: any = {}): Promise<any> {
  return make_request('get', uri,  {params: createPayload(payload) })
}

export async function api_post(uri: string, payload: any = {}): Promise<any> {
  return make_request('post', uri, { data: createPayload(payload)})
}

export async function api_delete(uri: string, payload: any = {}): Promise<any> {
  return make_request('delete', uri, { params: createPayload(payload)})
}

export async function api_put(uri: string, payload: any = {}): Promise<any> {
  return make_request('put', uri, { data: createPayload(payload)})
}

/**
 * Adds two important tokens to the payload :
 * - the auth token, identifying the user in the application
 * - the tab ID, used to determine on which tab the user is connected when using several.
 * 
 * @param rawPayload The data the frontend wants to send to the API before adding the various tokens.
 * @returns a record with the two tokens added to the raw data.
 */
function createPayload(rawPayload: Record<string, any>) {
  return {
    ...rawPayload, auth_token: useSession().token, tab_id: useTab().id
  }
}

export async function make_request(method: HttpMethod, url: string, payload: any = {}): Promise<any> {
  try {
    return (await axios.request({ method, url, ...payload })).data;
  }
  catch (exception: any) {
    const { key, message } = exception.response.data;
    if (key === 'auth_token') return useSession().reset()
    throw createError({
      statusCode: exception.response.status,
      statusMessage: `${key}.${message}`,
      fatal: true
    });
  }
}