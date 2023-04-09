/**
 * This interface describe how the value of a parameter can be edited.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default interface IDescriptor {
  id?: string;
  // The name of the descriptor, used solely to search for them with more ease.
  name: string;
  // The default value for this parameter descriptor, CAN be overriden in the tool parameter itself.
  default: number;
  // The value above which the parameter CANNOT be edited to, ensured in the API.
  maximum: number;
  // The value below which the parameter CANNOR be edited to, ensured in the API.
  minimum: number;
  // When editing the value, it will be rounded to a multiple of this value + the minimum.
  step: number;
  // The precision of numbers to display the value in the interface. 0 for whole numbers.
  precision: number;
}