export type IsAuthenticatedFct = (token: string) => boolean

export const isAuthenticated: IsAuthenticatedFct = token => token !== ""
