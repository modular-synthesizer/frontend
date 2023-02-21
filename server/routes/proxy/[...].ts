export default defineEventHandler(async (event) => {

  let body;

  try {
    body = await readBody(event);
  }
  catch(exception) {
    body = {};
  }

  return {
    method: event.node.req.method,
    url: `${process.env.API_URL}${event.path?.replace("/proxy", "")}`,
    params: getQuery(event),
    body,
  }
})
