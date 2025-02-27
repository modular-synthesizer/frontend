import { v4 as uuid } from 'uuid';

let tabId: string | undefined = undefined;

export function useTab() {
    return {
        get id(): string {
            if (tabId === undefined) tabId = uuid();
            return tabId;
        }
    }
}