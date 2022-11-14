import { InnerNode } from "../interfaces/ITool";
import { useAudioContext } from "../stores/audioContext";
import { useGenerators } from "../stores/tools/generators";
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
        const ctx = useAudioContext().context;
        return list.reduce((arr, innerNode) => {
            const genFunction: Function = useGenerators().scripts[innerNode.generator];
            const audioNodes: AudioNode[] = genFunction(innerNode.name, ctx);
            return [...arr, ...audioNodes]
        }, [])
    }
}

const factory = new InnerNodesFactory();

export default factory;