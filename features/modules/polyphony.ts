/**
 * An InnerNode is a wrapper for a Web Audio API Node (:waan) that allows us to connect it
 * oto, or disconnect it from other audio nodes easily. It is either running (it has a
 * corresponding waan), or is waiting to be instanciated.
 */
export type InnerNode = {
  name: string
  generator: string
} & (
  | { running: false }
  | { running: true; waan: AudioNode }
)

export type NodeGenerator = {
  name: string
} & (
  | { instanciated: false, code: string }
  | { instanciated: true, runner: () => AudioNode }
)

export function withWaan(generators: NodeGenerator[]): (n: InnerNode) => Promise<InnerNode> {
  return async (node: InnerNode): Promise<InnerNode> => {
    if (node.running) return node

    const generator = generators.find(g => (g.name === node.generator)) as NodeGenerator
    return { ...node, running: true, waan: await generator.runner() }
  }
}