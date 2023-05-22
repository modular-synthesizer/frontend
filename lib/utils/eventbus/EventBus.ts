import { flatten, map, uniq } from "lodash";
import EventFragment from "./EventFragment"

export default class EventBus {

  // The root fragment against which all paths are matched.
  private root: EventFragment = new EventFragment('');

  /**
   * Creates a subscription to a given topic in the event bus, allowing the reception of messages. Any message "more
   * general" than the path will be sent to the subscriber by calling the corresponding callback with the additional
   * payload attached to the message.
   * @param path the path, with fragments separated by slashes, for the desired messages. Path DO NOT have to pre-exist
   *   the subscription, if a path does not exist it will be created in the bus and listened on.
   * @param callback the function to call when the path is compatible with an emitted message.
   */
  public subscribe(path: string, callback: Function) {
    this.getOrCreate(path).addCallback(callback);
  }

  public unsubscribe(path: string, callback: Function) {
    this.getOrCreate(path).removeCallback(callback);
  }

  public getOrCreate(path: string): EventFragment {
    let fragment: EventFragment = this.root;
    path.split("/").forEach((part: string) => {
      fragment = fragment.getOrCreate(part, fragment);
    });
    return fragment;
  }

  /**
   * Emits a message in the event bus by forwarding it to each and every compatible subscriber. A subscriber is deemed
   * compatible if its path contains as a prefix the whole path of the emitted event, or if every variable fragments in
   * the emitted event path are compatible with it.
   * @param path the path of the emitted message used to route it to the desired clients.
   * @param payload the additional payload sent with the event, sent to the callback function chen matched.
   */
  public emit(path: string, payload: Object = {}): boolean {
    console.log(path);
    const parts: string[] = path.split('/');
    let fragments: EventFragment[] = [ this.root ]
    for (let part of parts) {
      // This unicity function will help avoid double invocations.
      fragments = uniq([
        ...fragments,
        // We take all the corresponding children for each fragment in the list.
        ...flatten(
          map(fragments, (fragment: EventFragment) => {
            return fragment.get(part);
          })
        ),
      ]);
    }
    fragments.forEach((fragment: EventFragment) => {
      fragment.trigger(path, payload);
    })
    return true
  }
}

export const eventbus = new EventBus();