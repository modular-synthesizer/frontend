import ITool from "../interfaces/ITool"

export class ToolsFactory {
  public empty(): ITool {
    return {
      id: "",
      name: "",
      categoryId: "",
      category: {id: "", name: ""},
      nodes: [],
      links: [],
      inputs: [],
      outputs: [],
      parameters: [],
      slots: 1,
      controls: []
    }
  }

  public emptyControl() {
    return {
      id: "",
      component: "SmallKnob",
      payload: {}
    }
  }
}

const factory = new ToolsFactory();

export default factory;