export default function(payload: any): void {
  const ws: WebSocket|undefined = useWebsockets();
  if (ws !== undefined && ws.readyState === 1) {
    useWebsockets().send(JSON.stringify(payload));
  }
}