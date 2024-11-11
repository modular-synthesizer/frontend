import axios from "axios";

export default class Api {

  private uri: string = "/proxy";

  public get token(): string {
    return localStorage.getItem("auth-token") || "";
  }

  public get(uri: string, payload: any = {}): Promise<any> {
    try {
      return axios.get(`${this.uri}${uri}`, {params: payload})
        .then(response => response.data);
    }
    catch(exception: any) {
      console.log("TEST ERREUR ICI");
      console.log(exception);
      throw createError({ statusCode: exception})
    }
  }

  public auth_get(uri: string, payload: any = {}): Promise<any> {
    return this.get(uri, {...payload, auth_token: this.token})
  }

  public post(uri: string, payload: any = {}): Promise<any> {
    return axios.post(`${this.uri}${uri}`, payload)
      .then(response => response.data)
  }

  public auth_post(uri: string, payload: any = {}): Promise<any> {
    return this.post(uri, {...payload, auth_token: this.token})
  }

  public delete(uri: string, payload: any = {}): Promise<any> {
    return axios.delete(`${this.uri}${uri}`, {data: payload})
      .then(response => response.data)
  }

  public auth_delete(uri: string, payload: any = {}): Promise<any> {
    return this.delete(uri, {...payload, auth_token: this.token})
  }

  public put(uri: string, payload: any = {}): Promise<any> {
    return axios.put(`${this.uri}${uri}`, payload)
      .then(response => response.data)
  }

  public auth_put(uri: string, payload: any = {}): Promise<any> {
    return this.put(uri, {...payload, auth_token: this.token})
  }
}

export const api = new Api();