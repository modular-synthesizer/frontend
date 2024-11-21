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
      ports: [],
      parameters: [],
      slots: 2,
      controls: [],
      experimental: true,
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