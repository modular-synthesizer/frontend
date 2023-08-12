import SynthesizerStartEdit from '~~/lib/commands/synthesizers/StartEdit'
import SynthesizerEndEdit from '~~/lib/commands/synthesizers/endEdit';
import SynthesizerStartDrag from '~~/lib/commands/synthesizers/startDrag';

let ws: WebSocket;

const commands: { [key: string]: any } = {
    'synthesizer.startEdit': SynthesizerStartEdit,
    'synthesizer.endEdit': SynthesizerEndEdit,
    'synthesizer.startDrag': SynthesizerStartDrag,
}

function init(): WebSocket {
    const uri = useRuntimeConfig().public.ws_url;
    const token = localStorage.getItem('auth-token');
    const websocket = new WebSocket(`${uri}?auth_token=${token}`);

    websocket.onclose = event => { ws = init(); }
    websocket.onmessage = handleMessage

    return websocket;
}

function handleMessage(event: MessageEvent) {
    const data: any = JSON.parse(event.data)
    const command: string = `${data.resource}.${data.operation}`;
    if (command in commands) {
        (new commands[command](data as any)).doRun
    }
}

export function useWebsockets() {
    if (!ws) ws = init();
    return ws;
}