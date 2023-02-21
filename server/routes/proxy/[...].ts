export default defineEventHandler(async (event) => {
  return {
    method: event.node.req.method,
    url: `${process.env.API_URL}${event.path?.replace("/proxy", "")}`,
    params: getQuery(event),
  }
})
