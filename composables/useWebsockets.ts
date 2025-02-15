import { eventbus } from '~/lib/utils/eventbus/EventBus';

let ws: WebSocket;

function init(): void {
    if (ws !== undefined) return;
    console.log("Initializing the websocket if needed");
    const uri = useRuntimeConfig().public.ws_url;
    const token = localStorage.getItem('auth-token');
    ws = new WebSocket(`${uri}?auth_token=${token}`);

    ws.onmessage = handleMessage;
    ws.onclose = init;
}

function handleMessage(event: MessageEvent) {
    const data: any = JSON.parse(event.data);
    console.log("emitting " + `${data.resource}.${data.operation}`)
    eventbus.emit(`${data.resource}.${data.operation}`, data);
}

export function useWebsockets() {
    init();
    return ws;
}

export function closeWebsocket() {
    if (ws !== undefined) ws.close(3005, 'page.close');
}