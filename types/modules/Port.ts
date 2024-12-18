import type { Cable } from "../Cable";
import type { ToolPort } from "../tools/Port";
import type { AudioModule } from "./AudioModule";

export type Port = ToolPort & {
  link: Cable | undefined;
  mod: AudioModule;
}