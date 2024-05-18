import ConnectorBuilder from "./connector-builder";
import NodeBuilder from "./node-builder";
import { Node } from "./types";

export default class Director {
  static instance: Director;
  nodeBuilder: NodeBuilder;
  connBuilder: ConnectorBuilder;
  nodes: Node[] = [];

  constructor(public svg: SVGSVGElement) {
    this.connBuilder = new ConnectorBuilder(svg, this.nodes);
    this.nodeBuilder = new NodeBuilder(svg, this.connBuilder);
  }

  addNode(left: number, top: number, text: string) {
    let node = this.nodeBuilder.creat(left, top, text);
    this.nodeBuilder.draggable(node);
    this.connBuilder.sourceAction(node);
    this.nodes.push(node);
  }

  static init(container: SVGSVGElement) {
    Director.instance = new Director(container);
  }
}