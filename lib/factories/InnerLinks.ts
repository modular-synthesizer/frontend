import type { InnerLink } from '~~/types/tools/InnerLink';
import InnerAudioNode from "../wrappers/InnerAudioNode";
import { find } from "lodash"
import type { ChannelNodes } from '~/types/modules/Channel';

class InnerLinksFactory {
    /**
     * Instanciates a set of audio links by binding the corresponding nodes at
     * the corresponding indices to create the interior audio pipeline for the
     * module.
     * @param nodes the audio nodes as instanciated by the corresponding factory.
     * @param links the links we have to creat between said nodes.
     * @returns the same list of links to be affected later in the module.
     */
    public link(nodes: ChannelNodes, links: InnerLink[]): InnerLink[] {
        return links.map(link => {
            if (/^[a-zA-Z]+\.[a-zA-Z]+$/.test(link.to.node)) {
                return this.linkToParameter(nodes, link)
            }
            else {
                return this.linkToOtherNode(nodes, link);
            }
        });
    }

    public linkToOtherNode(nodes: ChannelNodes, link: InnerLink) {
        const from = nodes[link.from.node];
        const to = nodes[link.to.node];
    
        if (!!from && !!to) from.connect(to, link.from.index, link.to.index);
        return link;
    }

    public linkToParameter(nodes: ChannelNodes, link: InnerLink) {
        const [nodeName, paramName] = link.to.node.split(".")
        const from = nodes[link.from.node];
        const to = nodes[nodeName];
    
        if (from !== undefined && to !== undefined) {
            if (to instanceof AudioWorkletNode) {
                const n = to as AudioWorkletNode;
                from.connect(n.parameters.get(paramName) as unknown as AudioParam);
            }
            else {
                from.connect(to[paramName as keyof AudioNode] as unknown as AudioParam)
            }
        }
        return link;
    }
}

const factory = new InnerLinksFactory();

export default factory;