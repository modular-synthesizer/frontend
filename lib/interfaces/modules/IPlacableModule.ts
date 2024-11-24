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

  /**
   * Checks if the position of the module intersects with another module's position.
   * @param {IPlacableModule} module the positionof the other module and its dimensions.
   * @return TRUE if the two modules intersect, FALSE otherwise.
   */
  intersects(module: IPlacableModule & Identifiable): boolean;
}