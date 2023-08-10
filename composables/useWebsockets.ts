import { ControlEditPayload } from '@/lib/commands/synthesizers/SynthesizerCommand';
import SynthesizerStartEdit from '~~/lib/commands/synthesizers/StartEdit'
import SynthesizerEndEdit from '~~/lib/commands/synthesizers/endEdit';

let ws: WebSocket;

function init(): WebSocket {
    const uri = useRuntimeConfig().public.ws_url;
    const token = localStorage.getItem('auth-token');
    const websocket = new WebSocket(`${uri}?auth_token=${token}`);

    websocket.onclose = event => {
        ws = init();
    }

    websocket.onmessage = handleMessage

    return websocket;
}

function handleMessage(event: MessageEvent) {

    const data: any = JSON.parse(event.data)
    const command: string = `${data.resource}.${data.operation}`;

    switch(command) {
        case 'synthesizer.startEdit':
            (new SynthesizerStartEdit(data as unknown as ControlEditPayload)).doRun();
            break;
        case 'synthesizer.endEdit':
            (new SynthesizerEndEdit(data as unknown as ControlEditPayload)).doRun();
            break;
    }
}

export function useWebsockets() {
    if (!ws) ws = init();
    return ws;
}