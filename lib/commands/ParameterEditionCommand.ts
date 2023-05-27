import Parameter from "../wrappers/Parameter";
import Command from "./Command";

export default class ParameterEditionCommand extends Command<Parameter> {

  private previousValue: number;

  private newValue: number;

  public constructor(parameter: Parameter, value: number) {
    super(parameter);
    this.previousValue = parameter.value;
    this.newValue = value;
  }

  public apply() {
    this.item.setValue(this.newValue);
  }

  public cancel() {
    this.item.setValue(this.previousValue);
  }
}