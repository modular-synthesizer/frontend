import { find } from "lodash";
import type { Generator } from "../../types/Generator";
import type { InnerNode } from '~~/types/tools/InnerNode';
import { useAudio } from "~~/composables/synthesizers/useAudio";

class InnerNodesFactory {
    /**
     * Instanciates a set of inner nodes from the API to transform them in audio
     * nodes usable in the global audio pipeline.
     * @param list the list of inner nodes of the module as returned by the API
     * @return the list of instanciated inner nodes with a :node field containing
     *   the corresponding Web Audio API node(s).
     */
    public async create(list: InnerNode[], generators: Generator[]): Promise<Record<string, AudioNode>> {
        const ctx: AudioContext = useAudio().context;
        const results: Record<string, AudioNode> = {}

        for(let innerNode of list) {
            const gen: Generator = find(generators, {name: innerNode.generator}) as Generator;

            if (gen !== undefined) {
                const executor = {func: async function(_ctx: AudioContext, _payload: any) {}};
                const fullcode: string = "executor.func = async function(context, payload) { " + gen.code + " };"
                eval(fullcode);
    
                const audioNode: AudioNode = await executor.func(ctx, {}) as unknown as AudioNode;
    
                if (audioNode instanceof AudioScheduledSourceNode) audioNode.start();
                results[innerNode.name] = audioNode;
            }
            else {
                console.warn(`Impossible to find generator ${innerNode.generator}`)
            }
        }

        return results;
    }
}

const factory = new InnerNodesFactory();

export default factory;