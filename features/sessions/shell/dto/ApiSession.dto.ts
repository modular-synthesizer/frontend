export type ApiSession = {
  token: string
  admin: boolean
  rights: { label: string }[]
  account: { id: string, username: string, email: string }
}