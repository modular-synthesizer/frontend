import IApi from "./IApi";
import axios from "axios";
import { useAuthentication } from "../stores/authentication";

export default class Api implements IApi {

  private uri: string = "";

  public get token(): string {
    return useAuthentication().session.token;
  }

  public get(uri: string, payload: any = {}): Promise<any> {
    return axios.get(`${this.uri}${uri}`, {params: payload})
      .then(response => response.data)
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

  public put(uri: string, payload: any = {}): Promise<any> {
    return axios.put(`${this.uri}${uri}`, payload)
      .then(response => response.data)
  }

  public setUri(uri: string) {
    this.uri = uri;
  }
}

export const api = new Api();