/**
 * A parameter target defines how a parameter descriptor is applied on the module. It says which node
 * the descriptor is supposed to target, and on which field of these nodes it's supposed to be applied.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default interface IParameterTarget {
  node: string;
  field: string;
}