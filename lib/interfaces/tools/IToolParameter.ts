import IDescriptor from "./IDescriptor";
import IParameterTarget from "./IParameterTarget";

export default interface IToolParameter {
  id?: string;
  // A name used to find the parameter with more ease, and to target it with controls.
  name: string;
  // An array of targets to apply the parameter on. A target has a node and a field to know what to edit.
  targets: IParameterTarget[];
  // Usually the value given when creating the corresponding descriptor, but can be overriden.
  default: number;
  // The description of the behavior for the corresponding value when instanciated.
  descriptor: IDescriptor;
}