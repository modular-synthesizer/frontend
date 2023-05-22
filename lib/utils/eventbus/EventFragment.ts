import { filter, find, remove } from "lodash";

export default class EventFragment {
  private content: string;
  private children: EventFragment[] = [];
  private callbacks: Function[] = [];
  private parent?: EventFragment;

  public constructor(content: string, parent?: EventFragment) {
    this.content = content;
    this.parent = parent;
  }

  public getOrCreate(part: string, parent?: EventFragment): EventFragment {
    let fragment: EventFragment = find(this.children, { content: part }) as EventFragment;
    if (fragment === undefined) {
      fragment = new EventFragment(part, fragment)
      this.children.push(fragment);
    }
    return fragment;
  }

  public addCallback(callback: Function) {
    this.callbacks.push(callback);
  }

  public removeCallback(callback: Function) {
    this.callbacks = this.callbacks.filter(c => c !== callback);
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

  public trigger(_path: string, payload: Object) {
    this.callbacks.forEach((callback: Function) => {
      callback(payload);
    })
  }

  public get path(): string {
    if (this.parent === undefined) return this.content;
    return [this.parent.path, this.content].join('/');
  }
}