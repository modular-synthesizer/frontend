let ws: WebSocket;

function init(): WebSocket {

    console.log("INITIALIZING THE WEBSOCKET");
    console.log(`url : ${useRuntimeConfig().public.ws_url}`);
    console.log(useRuntimeConfig().public);

    const uri = useRuntimeConfig().public.ws_url;
    const token = localStorage.getItem('auth-token');
    const websocket = new WebSocket(`${uri}?auth_token=${token}`);

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
    return ws;
}