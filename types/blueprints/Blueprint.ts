import type { Identified } from "../utils/Identified";
import type { Category } from "./Category";
import type { Control } from "./Control";
import type { InnerLink } from "./InnerLink";
import type { InnerNode } from "./InnerNode";
import type { ToolParameter } from "./Parameter";
import type { ToolPort } from "./Port";


/**
 * This type represents the whole structure of a blueprint in the synple application.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export type UncategorizedTool = Identified & {
    // The number of slots the blueprint is taken when instanciated as a module.
    slots: number;
    // The name of the blueprint, used as a translation key.
    name: string;
    // TRUE if the blueprint is meant to be tested, FALSE if it's production ready.
    experimental: boolean;
    // The list of internal nodes used when instanciating this blueprint.
    nodes: Array<InnerNode>;
    // The list of links between inner nodes.
    links: Array<InnerLink>;
    // The different parameters controlling the WAA audio parameters in the blueprint.
    parameters: Array<ToolParameter>;
    // The different ports offered by the structure of the blueprint.
    ports: Array<ToolPort>;
    // The controls offered to the user to pilot the modules.
    controls: Array<Control>;

    x: number;

    y: number;

    scale: number;
}

export type Blueprint = UncategorizedTool & {
    // The category this blueprint belongs to, used to sort blueprints by it.
    category: Category;
}