import ITool from "../interfaces/ITool";

class ToolsFactory {
    /**
     * Creates a structure representing an audio module, without any field set.
     * @return {IModule} the empty audio module created.
     */
    empty(): ITool {
        return {
            id: "",
            name: "",
            category_id: "",
            innerNodes: [],
            innerLinks: [],
            inputs: [],
            outputs: [],
            parameters: [],
            slots: 2
        }
    }
}

const factory = new ToolsFactory();

export default factory;