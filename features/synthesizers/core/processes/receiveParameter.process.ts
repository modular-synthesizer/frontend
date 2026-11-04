export type TimestampedValue = { t: number, value: number }

export type ReceiveParameterFct = (local: TimestampedValue, remote: TimestampedValue) => TimestampedValue

export const receiveParameter: ReceiveParameterFct = (local, remote) =>
  (local.t < remote.t) ? remote : local
