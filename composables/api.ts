import axios from "axios";

export async function make_get(uri: string, payload: any = {}): Promise<any> {
  try {
    return await axios.get(`/proxy${uri}`, {
      params: {
        ...payload,
        auth_token: localStorage.getItem("auth-token")
      }
    });
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