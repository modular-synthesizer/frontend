import { Identifiable } from "../common/Identifiable";

/**
 * This interface represents a module in a synthesizer, its slot and rack being its coordinates
 * in the referential of the synth, and the slots being its dimension (mainly to know if it fits).
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default interface IPlacableModule {
  slot: number;
  rack: number;
  slots: number;
}