import axios from "axios";
import { H3Event, createError } from "h3";
import { Agent } from "https";

const instance = axios.create({
  httpsAgent: new Agent({  
    rejectUnauthorized: false
  })
});

export default defineEventHandler(async (event: H3Event): Promise<any> => {
  const params = getQuery(event);
  const data = readBody(event);
  const url = `https://synple.app${event.path}`;
  const method = event.context.method;
  const headers = event.node.req.headers;

  try {
    const response: any = await instance({method, url, data, params, headers});
    event.node.res.statusCode = response.status;
    return response.data;
  }
  catch(exception: any) {
    const response = exception.response;
    event.node.res.statusCode = response.status;
    event.node.res.end(JSON.stringify(response.data));
  }
});