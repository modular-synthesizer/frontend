import { v4 as uuid } from 'uuid';

let tabId: string | undefined = undefined;

export function useTabId() {
    return {
        get get(): string {
            if (tabId === undefined) tabId = uuid();
            return tabId;
        }
    }
}