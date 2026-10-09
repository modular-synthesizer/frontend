export type InnerLinkEnd = { name: string, index?: number }

export type InnerLink = {
  from: InnerLinkEnd, to: InnerLinkEnd
}