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

  const config = {
    method: event.node.req.method,
    url: `${process.env.API_URL}${event.path?.replace("/proxy", "")}`,
    params: getQuery(event),
    data: body,
  };

  const results = (await instance(config) as any);

  setResponseStatus(event, results.status)

  return results.data
})
