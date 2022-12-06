import { InnerNode } from "../interfaces/ITool";
import InnerAudioNode from "../wrappers/InnerAudioNode";

class InnerNodesFactory {
    /**
     * Instanciates a set of inner nodes from the API to transform them in audio
     * nodes usable in the global audio pipeline.
     * @param list the list of inner nodes of the module as returned by the API
     * @return the list of instanciated inner nodes with a :node field containing
     *   the corresponding Web Audio API node(s).
     */
    public create(list: InnerNode[]): InnerAudioNode[] {
        const ctx: AudioContext = useAudioContext().context;
        return list.reduce((arr, innerNode) => {
            const genFunction: Function = useGenerators().scripts[innerNode.generator];
            const audioNodes: InnerAudioNode[] = genFunction(innerNode.name, ctx);
            audioNodes.forEach((a: InnerAudioNode) => {
                if (a.node instanceof AudioScheduledSourceNode) {
                    a.node.start();
                }
            })
            return [...arr, ...audioNodes]
        }, [])
    }
}

const factory = new InnerNodesFactory();

export default factory;