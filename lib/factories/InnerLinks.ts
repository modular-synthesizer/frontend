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
            const from = find(nodes, {name: link.from.node});
            const to = find(nodes, {name: link.to.node});
        
            if (from !== undefined && to !== undefined) {
                from.node.connect(to.node, link.from.index, link.to.index)
            }
            return link;
        });
    }
}

const factory = new InnerLinksFactory();

export default factory;