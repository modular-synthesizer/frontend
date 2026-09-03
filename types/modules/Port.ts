import type { Cable } from "../Cable";
import type { ToolPort } from "../blueprints/Port";
import type { AudioModule } from "./AudioModule";

export type Port = ToolPort & {
  link: Cable | undefined;
  mod: AudioModule;
}