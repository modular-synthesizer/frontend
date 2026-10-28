export type Facts<E> = { effects: E[] }

export type Effect = { type: string }

export type RunEffectFct<E extends Effect> = (effect: E) => Promise<void>

export const assertNever = (value: never): never => {
  throw new Error(`Effet non géré : ${JSON.stringify(value)}`)
}