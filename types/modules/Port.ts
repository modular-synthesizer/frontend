import type { ToolPort } from "../blueprints/Port";
import type { AudioModule } from "./AudioModule";

export type Port = ToolPort & {
  mod: AudioModule;
}