export default class PortsManager {
  private callbacks: Function[] = [];

  public constructor() {
    window.setInterval(() => this.triggerAll(), 1);
  }

  public add(callback: Function) {
    this.callbacks.push(callback);
  }

  public triggerAll() {
    this.callbacks.forEach(callback => {
      callback();
    });
  }
}