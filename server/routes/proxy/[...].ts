export default defineEventHandler(async (event) => {

  const method = event.node.req.method;
  const url = `${process.env.API_URL}${event.path?.replace("/proxy", "")}`;
  const params = getQuery(event) || {};
  const body = await readBody(event);
  const headers = getHeaders(event);

  return { body, method, url, params, headers }
})
