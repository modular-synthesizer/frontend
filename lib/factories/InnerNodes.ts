import { find } from "lodash";
import { IGenerator } from "../interfaces/IGenerator";
import { InnerNode } from "../interfaces/ITool";
import InnerAudioNode from "../wrappers/InnerAudioNode";

const AsyncFunction = async function () {}.constructor;

class InnerNodesFactory {
    /**
     * Instanciates a set of inner nodes from the API to transform them in audio
     * nodes usable in the global audio pipeline.
     * @param list the list of inner nodes of the module as returned by the API
     * @return the list of instanciated inner nodes with a :node field containing
     *   the corresponding Web Audio API node(s).
     */
    public async create(list: InnerNode[]): Promise<InnerAudioNode[]> {
        const ctx: AudioContext = useAudioContext().context as AudioContext;
        const gens: IGenerator[] = useGenerators().generators;
        const results: InnerAudioNode[] = [];

        for(let innerNode of list) {
            const gen: IGenerator = find(gens, {name: innerNode.generator}) as IGenerator;

            const executor = {func: async function(name: string, ctx: AudioContext) {}};
            const fullcode: string = "executor.func = async function(name, context) { " + gen.code + " };"
            eval(fullcode);

            const audioNodes: InnerAudioNode[] = await executor.func(innerNode.name, ctx) as unknown as InnerAudioNode[];

            audioNodes.forEach((a: InnerAudioNode) => {
                if (a.node instanceof AudioScheduledSourceNode) {
                    console.log(a);
                    a.node.start();
                }
                results.push(a);
            })
        }

        return results;
    }
}

const factory = new InnerNodesFactory();

export default factory;