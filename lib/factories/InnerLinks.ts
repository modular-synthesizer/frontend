import { InnerLink } from "../interfaces/ITool";
import InnerAudioNode from "../wrappers/InnerAudioNode";
import { find } from "lodash"

class InnerLinksFactory {
    /**
     * Instanciates a set of audio links by binding the corresponding nodes at
     * the corresponding indices to create the interior audio pipeline for the
     * module.
     * @param nodes the audio nodes as instanciated by the corresponding factory.
     * @param links the links we have to creat between said nodes.
     * @returns the same list of links to be affected later in the module.
     */
    public link(nodes: InnerAudioNode[], links: InnerLink[]): InnerLink[] {
        return links.map(link => {
            if (/^[a-z]+\.[a-z]+$/.test(link.to.node)) {
                return this.linkToParameter(nodes, link)
            }
            else {
                return this.linkToOtherNode(nodes, link);
            }
        });
    }

    public linkToOtherNode(nodes: InnerAudioNode[], link: InnerLink) {
        const from = find(nodes, {name: link.from.node});
        const to = find(nodes, {name: link.to.node});
    
        if (from !== undefined && to !== undefined) {
            from.node.connect(to.node, link.from.index, link.to.index)
        }
        return link;
    }

    public linkToParameter(nodes: InnerAudioNode[], link: InnerLink) {
        const [nodeName, paramName] = link.to.node.split(".")
        const from = find(nodes, {name: link.from.node});
        const to = find(nodes, {name: nodeName});

        console.log(from, to);
    
        if (from !== undefined && to !== undefined) {
            if (to.node instanceof AudioWorkletNode) {
                const n = to.node as AudioWorkletNode;
                from.node.connect(n.parameters.get(paramName) as unknown as AudioParam);
            }
            else {
                from.node.connect(to.node[paramName as keyof AudioNode] as unknown as AudioParam)
            }
        }
        return link;
    }
}

const factory = new InnerLinksFactory();

export default factory;