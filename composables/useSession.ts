import { useStorage } from "@vueuse/core"
import { repositories } from "~/lib/repositories";
import type { Session } from "~/types/authentication/Session"

const defaultSession: Session = {
  id: '', token: '', admin: false, rights: [], account: {
    id: '', username: 'unknown', email: 'unknown@synple.app'
  }
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
    async authenticate(username: string, password: string): Promise<void> {
      repositories.sessions.auth(username, password)
        .then((session: Session) => {
          storage.value = session
          navigateTo("/")
        });
    },
    reset() {
      repositories.sessions.delete(storage.value.token);
      storage.value = defaultSession;
      navigateTo('/');
    }
  }
}