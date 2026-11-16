import type { ObjectId } from "../../../shared/data/ObjectId.type"
import type { Connection } from "../../core/data/Cable.type"
import type { Port } from "../../core/data/Port.type"

export type VoiceNodes = Readonly<Record<string, AudioNode>>

export type NodesResolver = (moduleId: ObjectId) => readonly VoiceNodes[]

type NodeSearcher = (port: Port) => readonly (AudioNode | undefined)[]

type NodeSearcherFactory = (resolver: NodesResolver) => NodeSearcher

const searchNodes: NodeSearcherFactory = resolver => ({ moduleId, node }) => {
  return resolver(moduleId).map(vn => vn[node])
}

export type CableAudio = { connect: (connection: Connection) => void, disconnect: (connection: Connection) => void }

export type CableAudioFactory = (resolve: NodesResolver) => CableAudio

type Op = "connect" | "disconnect"

const apply = (resolve: NodesResolver, op: Op) => ({ origin, destination }: Connection): void => {
  const search = searchNodes(resolve)
  const outputNodes = search(origin)
  const inputNodes = search(destination)

  outputNodes.forEach((outputNode, k) => {
    if (!outputNode || !inputNodes[k]) return
    try {
      outputNode[op](inputNodes[k], origin.index, destination.index)
    } catch {
      console.error(`Impossible to ${op} node ${origin.node} to ${destination.node} on channel ${k}`)
    }
  })
}

export const makeCableAudio: CableAudioFactory = resolve => ({
  connect: apply(resolve, "connect"),
  disconnect: apply(resolve, "disconnect"),
})