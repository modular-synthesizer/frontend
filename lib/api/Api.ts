import IApi from "./IApi";
import axios from "axios";

export default class Api implements IApi {

  private uri: string = "";

  public get(uri: string, payload: any = {}): Promise<any> {
    return axios.get(`${this.uri}${uri}`, {params: payload})
      .then(response => response.data)
  }

  public post(uri: string, payload: any = {}): Promise<any> {
    return axios.post(`${this.uri}${uri}`, payload)
      .then(response => response.data)
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