// Routes that you can ONLY reach when NOT logged in the application.
export const ANONYMOUS_ROUTES: readonly string[] = [ "login", "register" ]
// Routes that can be both reached while logged in or not logged in.
export const PUBLIC_ROUTES: readonly string[] = [ "index" ]

export const HOME_PATH = "/"
