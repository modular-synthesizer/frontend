import type { InnerNodeTemplate } from "./InnerNode.type"

export type Port = {
  component: 'Port'
  index: number
  target: InnerNodeTemplate
}

export type Control =
  | Port