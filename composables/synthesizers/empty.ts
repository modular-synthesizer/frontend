import ISynthesizer from "~~/lib/interfaces/ISynthesizer";

/**
 * Creates an empty synthesizer with all the needed fields initialized with
 * values considered empty. Scale is voidat 1 so that it is neither zoomed in
 * nor zoomed out when displaying it for the first time.
 */
export function createEmptySynthesizer(): ISynthesizer {
  return {
    id: "", name: "", x: 0, y: 0, scale: 1, voices: 1, members: []
  }
}