import type { Uuid } from "./Uuid.type"

export type NodeGenerator<T> = () => Promise<T>

/**
 * A node template is a template to create wrapped audio nodes in a layer in the corresponding
 * audio module. The created nodes are then linked to other nodes using inner links templates
 * to determine the path of the signal in the nodes infrastructure.
 */
export type InnerNodeTemplate<T = AudioNode> = {
  /** A unique identifier used by controls to know on which node they must act */
  id: Uuid
  /** The name to be given to audio nodes created with this template. */
  name: string
  /** The function generating a Web Audio API AudioNode object to be able to work with audio signals. */
  generator: NodeGenerator<T>
}

/** Connection function, compatible with the AudioNode connect function */
type ConnectFct = 
| ((other: Connectable) => Connectable | undefined)
| ((other: Connectable, output: number) => Connectable | undefined)
| ((other: Connectable, output: number, input: number) => Connectable | undefined)

export type Connectable = { connect: ConnectFct }

/** Disconnection function, compatible with the AudioNode disconnect function */
type DisconnectFct<T> =
  | ((other: T) => undefined)
  | ((other: T, output: number) => undefined)
  | ((other: T, output: number, index: number) => undefined)

export type Disconnectable<T> = { disconnect: DisconnectFct<T> }

/**
 * An instanciated node, holding the representation of the web audio API node producing or
 * treating the signal. It will then be linked to other nodes to make the full path of the signal.
 */
export type InnerNode<T = AudioNode> = {
  /** The identifier of the inner node template reproduced in every layer to search for nodes */
  id: Uuid
  /** The name of the inner node identifying it. */
  name: string
  /** The Web Audio API AudioNode created in this inner node, handling or generating the signal. */
  audioNode: T
}