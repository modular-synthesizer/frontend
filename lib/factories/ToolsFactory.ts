import type { Tool } from '~~/types/tools/Tool';

export class ToolsFactory {
  public empty(): Tool {
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