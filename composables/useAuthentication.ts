import type { Session } from "~/types/authentication/Session";
import { repositories } from "~~/lib/repositories";

interface Payload {
  session: Session;
  storage: any;
}

function emptySession(): Session {
  return {
    id: "",
    token: "",
    admin: false,
    rights: [],
    account: { username: '', email: '', id: '' }
  }
}

const state: Ref<Payload> = ref({
  session: emptySession() as Session,
  storage: useStorage()
});

export function useAuthentication() {
  return {
    state,
    get authenticated(): boolean {
      return this.session.token !== ""
    },
    get admin(): boolean {
      return !!this.session.admin;
    },
    get token(): string {
      if(this.session?.token !== '') return this.session.token;
      return state.value.storage.get('auth-token');
    },
    get session(): Session {
      return state.value.session
    },
    get username(): string {
      return this.session.account.username;
    },
    /**
     * Authenticates a user on the API given their credentials. If the request
     * on the API to authenticate him succeeds, the session is stored here and
     * the token is stored in the local storage to be found again when refreshing
     * the session when displaying any page.
     * 
     * @param username the nickname of the user authenticating on the API
     * @param password the password the user is trying to use to authenticate.
     * 
     * @return The promise for the login form to handle errors.
     */
    async login(username: string, password: string): Promise<void> {
      state.value.session = await repositories.sessions.auth(username, password);
      await state.value.storage.set("auth-token", this.session.token);
      await state.value.storage.set("session", JSON.stringify(this.session));
      setRights(this.session.rights)
      navigateTo("/");
    },
    /**
     * Logs the user out of the application by deleting their session and deleting
     * their authentication token from the local storage. It removes the session
     * from the database, but doesn't care if the requests succeeds as the session
     * will be considered deleted anyway.
     */
    async logout(): Promise<void> {
      const token: string = state.value.session.token
      if (!token) return;
      repositories.sessions.delete(token);
      state.value.storage.remove("auth-token");
      state.value.storage.remove("session");
      closeWebsocket();
      state.value.session = emptySession();
      setRights([])
      window.location.href = '/';
    },
    /**
     * Refreshes the session by reading the token in the local storage and
     * recreating the session object in this storage so that the user does not
     * have to login again in the application when its session is still valid.
     */
    async refresh(): Promise<Session|void> {
      if (!this.token) return;
      try {
        state.value.session = await repositories.sessions.get(this.token);
        setRights(this.session.rights)
        return this.session
      }
      catch (exception: any) {
        this.logout();
      }
    }
  }
};