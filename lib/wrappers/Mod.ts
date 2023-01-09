import { InnerLink, InnerNode } from "../interfaces/ITool";
import IModule from "../interfaces/IModule";
import Port, { InputPort, OutputPort } from "./Port";
import InnerAudioNode from "./InnerAudioNode";
import InnerNodesFactory from '../factories/InnerNodes'
import InnerLinksFactory from '../factories/InnerLinks'
import Parameter from "./Parameter";
import { flatten } from 'lodash';
import Link from "./Link";

export default class Mod {
  public readonly id: string;
  public readonly nodes: InnerNode[];
  public readonly links: InnerLink[]
  public rack: number;
  public slot: number;
  public readonly slots: number;
  public readonly type: string;
  public readonly inputs: Port[] = []
  public readonly outputs: Port[] = []
  public audioNodes: InnerAudioNode[] = []
  public readonly parameters: Parameter[];
  public readonly category: string;

  constructor({ id, rack, slot, slots, type, nodes, links, inputs, outputs, parameters, category }: IModule) {
    this.id = id;
    this.rack = rack;
    this.slot = slot;
    this.slots = slots;
    this.type = type;
    this.nodes = nodes;
    this.inputs = inputs.map(input => new InputPort(input, this));
    this.outputs = outputs.map(output => new OutputPort(output, this));
    this.category = category;

    this.audioNodes = InnerNodesFactory.create(nodes)
    this.links = InnerLinksFactory.link(this.audioNodes, links);
    this.parameters = parameters.map(p => new Parameter(p, this));

    usePorts().addPorts([...this.inputs, ...this.outputs]);
  }

  public node(name: string) {
    return this.audioNodes.find((a: InnerAudioNode) => a.name === name);
  }

  public param(name: string) {
    return this.parameters.find((p: Parameter) => p.name === name);
  }

  public get ports(): Port[] {
    return [...this.inputs, ...this.outputs]
  }

  public get connections(): Link[] {
    return flatten(this.ports.map((port: Port) => port.links))
  }
}