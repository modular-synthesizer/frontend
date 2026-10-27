export type Facts<E> = { effects: E[] }

export type Effect = { type: string }

export const assertNever = (value: never): never => {
  throw new Error(`Effet non géré : ${JSON.stringify(value)}`)
}