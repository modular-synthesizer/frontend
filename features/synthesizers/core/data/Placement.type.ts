/**
 * This positions a module in a modular synthesizer by giving its coordinates in a eurorack system.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export type Placement = {
  // The rack is the "line" the module is in, the higher the value, the lower the module.
  rack: number
  // The slot is the horizontal position in the line, the higher, the more on the right.
  slot: number
}