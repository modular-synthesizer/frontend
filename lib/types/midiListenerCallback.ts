import KeyMapper from "../interfaces/KeyMapper";

type midiListenerCallback = (pitch: number, mapper: KeyMapper) => void;

export default midiListenerCallback;