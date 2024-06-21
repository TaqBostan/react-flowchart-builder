import CircleBuilder from "./builders/circle/circ-builder";
import RectBuilder from "./builders/rect/rect-builder";
import RhomBuilder from "./builders/rhom/rhom-builder";
import ConnectorBuilder from "./connector-builder";
import NodeBuilder from "./node-builder";
import { ConnectorData, Node } from "./types";

export default class Director {
  static instance: Director;
  builders: NodeBuilder<Node>[];
  connBuilder: ConnectorBuilder;
  nodes: Node[] = [];

  constructor(public svg: SVGSVGElement) {
    this.connBuilder = new ConnectorBuilder(svg, this.nodes);
    this.builders = [new RectBuilder(svg, this.connBuilder), new CircleBuilder(svg, this.connBuilder), new RhomBuilder(svg, this.connBuilder)];
  }

  getBuilder<T extends Node>(node: T): NodeBuilder<T> {
    return this.builders.find(b => b.ofType(node))! as NodeBuilder<T>;
  }

  addNodes(nodes: Node[]) {
    nodes.forEach(node => this.addNode(node));
  }

  addConns(conns: ConnectorData[] = []) {
    conns.forEach(connector => {
      let origin = this.nodes.find(n => n.id === connector.from), destination = this.nodes.find(n => n.id === connector.to);
      if (!origin || !destination) throw Error('Node from/to not found!');
      this.connBuilder.sourceNode = origin;
      this.connBuilder.connect(destination, connector.text);
    });
  }

  getData() {
    return {
      nodes: this.nodes.map(n => ({ id: n.id, X: n.left, Y: n.top, text: n.text, shape: n.shape })),
      connectors: this.nodes.reduce(
        (conns: ConnectorData[], node) => [...conns,
        ...node.connectors
          .filter(n => n.toDest)
          .map(conn => ({ from: node.id, to: conn.nextNode.id, text: conn.label.text }))],
        []
      )
    }
  }

  addNode(node: Node): number {
    if (node.id !== 0 && this.nodes.some(n => n.id === node.id)) throw Error('Duplicate ID found: ' + node.id);
    let builder = this.getBuilder(node);
    builder.add(node);
    builder.draggable(node);
    this.connBuilder.sourceAction(node);
    this.nodes.push(node);
    return node.id;
  }

  static init(container: SVGSVGElement) {
    Director.instance = new Director(container);
  }
}