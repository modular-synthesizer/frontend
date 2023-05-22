import { filter, find } from "lodash";

export default class EventFragment {
  private content: string;
  private children: EventFragment[] = [];
  private callbacks: Function[] = [];

  public constructor(content: string) {
    this.content = content;
  }

  public getOrCreate(part: string): EventFragment {
    let fragment: EventFragment = find(this.children, { content: part }) as EventFragment;
    if (fragment === undefined) {
      fragment = new EventFragment(part)
      this.children.push(fragment);
    }
    return fragment;
  }

  public addCallback(callback: Function) {
    this.callbacks.push(callback);
  }

  public has(content: string): boolean {
    return !!find(this.children, (child: EventFragment) => {
      return child.matches(content);
    });
  }

  public get(content: string) {
    return filter(this.children, (child: EventFragment) => {
      return child.matches(content);
    })
  }

  public matches(content: string): boolean {
    return /^\[[a-z]+\]$/.test(this.content) || this.content === content;
  }

  public trigger() {
    this.callbacks.forEach((callback: Function) => {
      callback();
    })
  }
}