import { eventbus } from '~/lib/utils/eventbus/EventBus';

let ws: EventSource;

type Command = {
    operation: string,
    payload: Record<string, any>
}

function init(): void {
    if (ws !== undefined) return;
    console.log("Initializing the websocket if needed");
    const uri = useRuntimeConfig().public.ws_url;
    const token = localStorage.getItem('auth-token');
    ws = new EventSource('https://synple-notifications-5677e9975556.herokuapp.com?auth_token='+token);

    ws.onmessage = (message) => {
        console.log("Handling new message : ", message.data)
        handleMessage(message.data)
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