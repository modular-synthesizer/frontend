import axios from "axios";

type HttpMethod = 'get'|'post'|'put'|'delete';

/**
 * Makes a GET request on the API, usually to gather informations about a list of elements, or an element.
 * @param uri the URI to get the item from on the API (drop the proxy prefix from the frontend).
 * @param payload all parameters passed as querystring in the URL if necessary (for example pagination in a list)
 * @returns a promise to be waited on, containing the results returned in the body of the response.
 */
export async function api_get(uri: string, payload: any = {}): Promise<any> {
  return make_request('get', uri,  {params: { ...payload, auth_token: token() } })
}

export async function api_post(uri: string, payload: any = {}): Promise<any> {
  return make_request('get', uri, { data: { ...payload, auth_token: token() }})
}

function token() {
  return localStorage.getItem("auth-token");
}

export async function make_request(method: HttpMethod, uri: string, payload: any = {}): Promise<any> {
  try {
    const url: string = `/proxy${uri}`;
    return (await axios.request({ method, url, ...payload })).data;
  }
  catch (exception: any) {
    const { key, message } = exception.response.data;
    throw createError({
      statusCode: exception.response.status,
      statusMessage: `${key}.${message}`,
      fatal: true
    });
  }
}