import axios from "axios";
import * as https from "https";

export default defineEventHandler(async (event) => {

  let body;

  try {
    body = await readBody(event);
  }
  catch(exception) {
    body = {};
  }

  const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    }),
    validateStatus: function(status) { return true }
  });

  const url = `${process.env.API_URL}${event.path?.replace("/proxy", "")}`

  const headers = {
    "X-PUBLIC-KEY": process.env.PUBLIC_KEY,
    "X-PRIVATE-KEY": process.env.PRIVATE_KEY,
  }

  const config = {
    method: event.node.req.method,
    url: url,
    params: getQuery(event),
    data: body,
    headers,
  };

  const results = (await instance(config) as any);

  // @ts-ignore
  setResponseStatus(event, results.status);
  
  if (results.headers['content-type'] !== undefined) {
    setHeader(event, 'Content-Type', results.headers['content-type']);
  }

  return results.data
})
