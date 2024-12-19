export interface IStartable { start(): void }
export interface IStoppable { stop(): void }
export interface IManageable extends IStartable, IStoppable {};