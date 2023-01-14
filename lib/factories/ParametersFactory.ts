import IParameter from "../interfaces/IParameter";

export class ParametersFactory {
  public empty(): IParameter {
    return {
      id: "",
      name: "",
      constraints: {
        minimum: 0,
        maximum: 1,
        step: 1,
        precision: 0
      },
      value: 0,
      targets: [],
      field: ""
    }
  }
}

const factory = new ParametersFactory();

export default factory;