import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ISession from "~~/lib/interfaces/ISession";
import { storage } from "./storage"

export const useAuthentication = defineStore('authentication', {
  state: (): IAuthenticationState => ({
    session: emptySession(),
    storage: storage()
  }),
  getters: {
    authenticated(): boolean {
      return this.session.token !== ""
    },
    admin(): boolean {
      return !!this.session.admin;
    }
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
    login(username: string, password: string): Promise<any> {
      return api.post("/sessions", { username, password })
        .then((session: ISession) => {
          this.storage.set("auth-token", session.token);
          this.session = session;
          navigateTo("/");
        })
    },
    /**
     * Logs the user out of the application by deleting their session and deleting
     * their authentication token from the local storage. It removes the session
     * from the database, but doesn't care if the requests succeeds as the session
     * will be considered deleted anyway.
     */
    logout(): void {
      const token: string = this.session.token;
      api.delete(`/sessions/${token}`, {auth_token: token})
      this.storage.remove("auth-token");
      this.session = emptySession();
      navigateTo("/");
    },
    /**
     * Refreshes the session by reading the token in the local storage and
     * recreating the session object in this storage so that the user does not
     * have to login again in the application when its session is still valid.
     */
    refresh(): void {
      if (this.storage.has("auth-token")) {
        const token: string = this.storage.get("auth-token");
        api.get(`/sessions/${token}`, {auth_token: token})
          .then((response: ISession) => this.session = response)
          .catch(_error => this.logout());
      }
    }
  }
})

interface IAuthenticationState {
  session: ISession;
  storage: any;
}

function emptySession(): ISession {
  return {
    token: "",
    username: "",
    email: "",
    admin: false
  }
}