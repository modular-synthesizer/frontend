import { defineStore } from "pinia";
import ISession from "~~/lib/interfaces/ISession";
import { repositories } from "~~/lib/repositories";

export const useAuthentication = defineStore('authentication', {
  state: (): IAuthenticationState => ({
    session: emptySession() as ISession,
    storage: useStorage()
  }),
  getters: {
    authenticated(): boolean {
      return this.session.token !== ""
    },
    admin(): boolean {
      return !!this.session.admin;
    },
    token(): string {
      if(this.session?.token !== '') return this.session.token;
      return this.storage.get('auth-token');
    },
  },
  actions: {
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
    async login(username: string, password: string): Promise<any> {
      this.session = await repositories.sessions.auth(username, password);
      await this.storage.set("auth-token", this.session.token);
      await this.storage.set("session", JSON.stringify(this.session));
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
      if (!this.token) return;
      repositories.sessions.delete(this.token);
      this.storage.remove("auth-token");
      this.storage.remove("session");
      closeWebsocket();
      this.session = emptySession();
      setRights([])
      window.location.href = '/';
    },
    /**
     * Refreshes the session by reading the token in the local storage and
     * recreating the session object in this storage so that the user does not
     * have to login again in the application when its session is still valid.
     */
    async refresh(): Promise<ISession|undefined> {
      if (!this.token) return;
      try {
        this.session = await repositories.sessions.get(this.token);;
        setRights(this.session.rights)
        return this.session
      }
      catch (exception: any) {
        this.logout();
      }
    }
  }
});

interface IAuthenticationState {
  session: ISession;
  storage: any;
}

function emptySession(): ISession {
  return {
    id: "",
    token: "",
    username: "",
    email: "",
    admin: false,
    account_id: "",
    rights: []
  }
}