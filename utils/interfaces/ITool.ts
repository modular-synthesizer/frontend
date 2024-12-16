import type { CategoryType } from "~/types/tools/Category";

export interface ITool {
    get category(): CategoryType;
}