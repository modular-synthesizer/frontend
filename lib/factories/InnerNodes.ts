import { find } from "lodash";
import { IGenerator } from "../interfaces/IGenerator";
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
        const ctx: AudioContext = useAudioContext().context as AudioContext;
        const gens: IGenerator[] = useGenerators().generators;
        return list.reduce((arr, innerNode): InnerAudioNode[] => {
            const gen: IGenerator = find(gens, {name: innerNode.generator}) as IGenerator;
            const genFunction: Function = Function('name', 'context', gen.code);
            const audioNodes: InnerAudioNode[] = genFunction(innerNode.name, ctx);
            audioNodes.forEach((a: InnerAudioNode) => {
                if (a.node instanceof AudioScheduledSourceNode) {
                    a.node.start();
                }
            })
            return [...arr, ...audioNodes]
        }, [] as InnerAudioNode[])
    }
}

const factory = new InnerNodesFactory();

export default factory;