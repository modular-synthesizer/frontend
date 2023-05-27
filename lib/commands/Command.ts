/**
 * This implementation of the Command design pattern makes it possible to have reversable parameters edition.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default abstract class Command<T> {
  // The item the command is applied on.
  protected item: T;

  constructor(item: T) {
    this.item = item;
  }

  public abstract apply(): void;

  public abstract cancel(): void;
}