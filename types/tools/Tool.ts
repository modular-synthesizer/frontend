import type { Identified } from "../utils/Identified";
import type { Control } from "./Control";
import type { InnerLink } from "./InnerLink";
import type { InnerNode } from "./InnerNode";
import type { ToolParameter } from "./Parameter";
import type { ToolPort } from "./Port";

/**
 * This type represents the whole structure of a tool in the synple application.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export type Tool = Identified & {
    // The unique identifier of the catgory this tool is placed into.
    categoryId: string;
    // The number of slots the tool is taken when instanciated as a module.
    slots: number;
    // The name of the tool, used as a translation key.
    name: string;
    // TRUE if the tool is meant to be tested, FALSE if it's production ready.
    experimental: boolean;
    // The list of internal nodes used when instanciating this tool.
    nodes: Array<InnerNode>;
    // The list of links between inner nodes.
    links: Array<InnerLink>;
    // The different parameters controlling the WAA audio parameters in the tool.
    parameters: Array<ToolParameter>;
    // The different ports offered by the structure of the tool.
    ports: Array<ToolPort>;
    // The controls offered to the user to pilot the modules.
    controls: Array<Control>;
}