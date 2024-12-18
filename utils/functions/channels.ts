import { some, find } from "lodash";
import type { Channel } from "~/types/modules/Channel";

/**
 * Stops a serie of channels by stopping all the scheduled noise, ie all the nodes that have been previously started.
 * These nodes include, but are not limited to : oscillators, nodes playing playbacks, etc.
 * 
 * @param channels the array of channels to search and stop nodes into. 
 */
export function stopChannels(channels: Array<Channel>): void {
  channels.forEach((channel: Channel) => {
    Object.values(channel.nodes).forEach((node: AudioNode) => {
      if (node instanceof AudioScheduledSourceNode) node.stop();
    })
  })
}