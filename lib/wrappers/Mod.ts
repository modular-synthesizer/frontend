import { InnerLink, InnerNode } from "../interfaces/ITool";
import IModule from "../interfaces/IModule";
import Port, { InputPort, OutputPort } from "./Port";
import InnerAudioNode from "./InnerAudioNode";
import InnerNodesFactory from '../factories/InnerNodes'
import InnerLinksFactory from '../factories/InnerLinks'
import Parameter from "./Parameter";
import { flatten } from 'lodash';
import Link from "./Link";
import { IControl } from "../interfaces/IControl";
import IPort from "../interfaces/IPort";

export default class Mod {
  public readonly id: string;
  public readonly nodes: InnerNode[];
  public readonly links: InnerLink[]
  public rack: number;
  public slot: number;
  public readonly slots: number;
  public readonly type: string;
  public readonly ports: Port[] = [];
  public audioNodes: InnerAudioNode[] = []
  public readonly parameters: Parameter[];
  public readonly category: string;
  public readonly controls: IControl[] = [];

  constructor({ id, rack, slot, slots, type, nodes, links, ports, parameters, category, controls }: IModule) {
    this.id = id;
    this.rack = rack;
    this.slot = slot;
    this.slots = slots;
    this.type = type;
    this.nodes = nodes;
    this.category = category;
    this.controls = controls;
    
    this.ports = ports.map((iport: IPort) => {
      return iport.kind === "input" ? new InputPort(iport, this) : new OutputPort(iport, this);
    });

    this.audioNodes = InnerNodesFactory.create(nodes)
    this.links = InnerLinksFactory.link(this.audioNodes, links);
    this.parameters = parameters.map(p => new Parameter(p, this));

    usePorts().addPorts(this.ports);
  }

  public get inputs(): IPort[] {
    return this.ports.filter((p: Port) => p.kind === "input");
  }

  public get outputs(): IPort[] {
    return this.ports.filter((p: Port) => p.kind === "output");
  }

  public node(name: string) {
    return this.audioNodes.find((a: InnerAudioNode) => a.name === name);
  }

  public param(name: string): Parameter {
    return this.parameters.find((p: Parameter) => p.name === name) as Parameter;
  }

  public get connections(): Link[] {
    return flatten(this.ports.map((port: Port) => port.links))
  }
}