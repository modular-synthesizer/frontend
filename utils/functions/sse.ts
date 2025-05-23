import { eventbus } from '~/utils/eventbus/EventBus';

let source: EventSource;

// Represents a command sent in the SSE socket by the server.
type ParsedMessage = {
    operation: string,
    tabId: string,
    payload: Record<string, unknown>,
}

export type Command = { tabId: string } & Record<string, unknown>;

/**
 * Initializes the SSE connection to the server. Connections will stay open as long as the server
 * feels like, and we'll receive messages from the rabbitMQ broker, transmitted by the notifications
 * service to the designated users. Messages have some interesting attributes :
 * - operation : the current kind of operation you're trying to accomplish, used to route messages
 *               inside the application in the event bus.
 * - tabId : the UUID of the tab making the operations that triggered this notification to other
 *           user, CAN be null or undefined, is a string otherwise.
 */
export function initializeSSE(): void {
    if (source !== undefined) return;
    const url = useRuntimeConfig().public.sse_url;
    source = new EventSource(`${url}?auth_token=${useSession().token}`);

    source.onmessage = (message: MessageEvent) => {
        const { operation, tabId, payload }: ParsedMessage = JSON.parse(message.data);
        console.log({ operation, tabId, ...payload })
        eventbus.emit(operation, { ...payload, tabId: tabId ?? '' } as Command)
    }
    console.log("SSE connection successfully initialized");
}