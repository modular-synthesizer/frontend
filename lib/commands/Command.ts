import CommandException from "./CommandException";

export default abstract class Command<T extends {[key: string]: any}> {

  protected payload: T;

  constructor(payload: T) {
    this.payload = payload;
  }

  public doRun() {
    if (!this.doValidate()) return;
    this.run();
  }

  public required(...fields: string[]): boolean {
    for(let field of fields) {
      if (!(field in this.payload)) {
        throw new CommandException();
      }
    }
    return true;
  }

  public validate(): boolean {
    return true;
  }

  public doValidate(): boolean {
    try {
      return this.validate();
    }
    catch(exception: any) {
      return false;
    }
  }

  public abstract run(): void;
}