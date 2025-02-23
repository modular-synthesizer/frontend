import { eventbus } from '~/lib/utils/eventbus/EventBus';

let ws: EventSource;

type Command = {
    operation: string,
    payload: Record<string, any>
}

function init(): void {
    if (ws !== undefined) return;
    console.log("Initializing the websocket if needed");
    const url = useRuntimeConfig().public.sse_url;
    const token = localStorage.getItem('auth-token');
    ws = new EventSource(url + '?auth_token=' + token);

    ws.onmessage = (message) => {
        console.log("Handling new message : ", message.data)
        handleMessage(JSON.parse(message.data));
    }
}

function handleMessage(event: Command) {
    eventbus.emit(event.operation, event.payload);
}

export function useWebsockets() {
    init();
    return ws;
}

export function closeWebsocket() {
    if (ws !== undefined) ws.close();
}