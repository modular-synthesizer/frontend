import { ISynthesizer } from "../interfaces/ISynthesizer";
import { times } from "lodash";
import Rack from "./Rack";

/**
 * A synthesizer is the main object of the application. It is materialized
 * as an interface on which all nodes and links are drawn.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class Synthesizer {
  // The unique UUID of the synthesizer, identifying it for requests.
  public readonly id: string;
  // The name the user has given to this synthesizer.
  public readonly name: string;
  // The number of pixels from the left side to the left of the first slot.
  public x: number;
  // The number of pixels from the top to the top of the first slot.
  public y: number;
  // The scale of zoom the synthesizer is currently displayed at.
  public scale: number;
  // The list of racks available in the synthesizer.
  private racks: Rack[];

  public constructor(infos: ISynthesizer) {
    this.id = infos.id;
    this.name = infos.name;
    this.x = infos.x;
    this.y = infos.y;
    this.scale = infos.scale;

    this.initRacks(infos);
  }

  private initRacks(infos: ISynthesizer) {
    this.racks = [] as Rack[];
    times(infos.racks, (index: number) => {
      this.racks.push(new Rack(index, infos.slots));
    })
  }
}