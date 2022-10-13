import IApi from "./IApi";
import axios from "axios";

export default class Api implements IApi {

  private uri: string;

  public constructor(config: any) {
    this.uri = config.public.api_uri;
  }

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
}