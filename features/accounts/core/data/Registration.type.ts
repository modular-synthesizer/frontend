/**
 * A registration attempt with all fields provided by the user. This might not be
 * a valid registration, as it does not assess value formats for example.
 * 
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export type Registration = {
  username: string,
  email: string,
  password: string,
  password_confirmation: string
}