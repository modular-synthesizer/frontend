import { useStorage } from "@vueuse/core"
import { find } from "lodash";
import { repositories } from "~/lib/repositories";
import type { Session } from "~/types/authentication/Session"
import type { Right } from "~/types/permissions/Right";
import { initializeSSE } from "~/utils/functions/sse";

const defaultSession: Session = {
  id: '', token: '', admin: false, rights: [], account: {
    id: '', username: 'unknown', email: 'unknown@synple.app'
  }
}

function reset() {
  storage.value = defaultSession;
  navigateTo('/');
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
      return storage.value.token !== ''
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
    async authenticate(username: string, password: string): Promise<void> {
      repositories.sessions.auth(username, password)
        .then((session: Session) => {
          storage.value = session
          initializeSSE();
          navigateTo("/")
        });
    },
    async logout() {
      await repositories.sessions.delete(storage.value.token);
      reset();
    },
    reset,
    refresh() {
      if (storage.value.token !== '') {
        repositories.sessions.get(storage.value.token)
          .catch(() => {
            console.log("Session invalide trouvée, redirection");
            reset()
          })
      }
    }
  }
}