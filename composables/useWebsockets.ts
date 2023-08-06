let ws: WebSocket;

function init(): WebSocket {
    const uri = useRuntimeConfig().public.ws_url;
    const token = localStorage.getItem('auth-token');
    const websocket = new WebSocket(`${uri}?auth_token=${token}`);

    console.log("INITIALIZING THE WEBSOCKET");

    websocket.onclose = event => {
        console.log("CLOSE EVENT");
        ws = init();
    }

    websocket.onmessage = event => {
        console.log("MESSAGE EVENT");
        console.log(event);
    }

    return websocket;
}

export function useWebsockets() {
    if (!ws) ws = init();

        // setTimeout(() => {
        //     const body = {
        //         resource: 'synthesizer',
        //         synthesizer_id: '6470dc06bf8c72000625bedf',
        //         operation: 'startEdit'
        //     }
        //     console.log(body);
        //     ws.send(JSON.stringify(body));
        // }, 1000)
    return ws;
}