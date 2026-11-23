import { useStorage } from "@vueuse/core"
import { find } from "lodash";
import { isAuthenticated } from "~/features/sessions/core/shared/isAuthenticated";
import type { Session } from "~/types/authentication/Session"
import type { Right } from "~/types/permissions/Right";

const defaultSession: Session = {
  id: '', token: '', admin: false, rights: [], account: {
    id: '', username: 'unknown', email: 'unknown@synple.app'
  }
}

function reset() {
  clear()
  navigateTo('/');
}

function clear() {
  storage.value = defaultSession;
}

const storage = useStorage('session', defaultSession, localStorage, { mergeDefaults: true });

export function useSession() {
  return {
    get token(): string {
      return storage.value.token
    },
    get admin(): boolean {
      return storage.value.admin;
    },
    get authenticated(): boolean {
      return isAuthenticated(storage.value.token)
    },
    get username(): string {
      return storage.value.account.username;
    },
    get accountId(): string {
      return storage.value.account.id;
    },
    can(right: string): boolean {
      return !!find(storage.value.rights, (r: Right) => r.label === right)
    },
    store(session: Session) {
      storage.value = session
    },
    reset,
    clear,
  }
}