export function sendMessage(payload: Object) {
  return useWebsockets().send(JSON.stringify(payload));
}