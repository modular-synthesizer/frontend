import IApi from "./IApi";
import axios from "axios";

export default class ProdApi implements IApi {

  private uri: string;

  public constructor(uri: string) {
    this.uri = uri
    console.log("pouet")
    console.log(`API plugged on ${this.uri}`)
  }

  get(uri: string, payload: any = {}): Promise<any> {
    return axios.get(`${this.uri}${uri}`, payload).then(response => response.data)
  }

  post(uri: string, payload: any = {}): Promise<any> {
    return axios.post(`${this.uri}${uri}`, payload).then(response => response.data)
  }
}