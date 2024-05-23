import ConnectorBuilder from "./connector-builder";
import NodeBuilder from "./node-builder";
import { ConnectorData, Node, NodeData } from "./types";

export default class Director {
  static instance: Director;
  nodeBuilder: NodeBuilder;
  connBuilder: ConnectorBuilder;
  nodes: Node[] = [];

  constructor(public svg: SVGSVGElement) {
    this.connBuilder = new ConnectorBuilder(svg, this.nodes);
    this.nodeBuilder = new NodeBuilder(svg, this.connBuilder);
  }

  addNodes(nodes: NodeData[], conns: ConnectorData[] = []) {
    nodes.forEach(node => this.addNode(node.X, node.Y, node.text, node.id));
    conns.forEach(connector => {
      let origin = this.nodes.find(n => n.id === connector.from), destination = this.nodes.find(n => n.id === connector.to);
      if (!origin || !destination) throw Error('Node from/to not found!');
      this.connBuilder.sourceNode = origin;
      this.connBuilder.connect(destination);
    });
  }

  getData() {
    return {
      nodes: this.nodes.map(n => ({ id: n.id, X: n.left, Y: n.top, text: n.text })),
      connectors: this.nodes.reduce(
        (conns: ConnectorData[], node) => [...conns, ...node.connectors.filter(n => n.toDest).map(conn => ({ from: node.id, to: conn.nextNode.id }))],
        []
      )
    }
  }

  addNode(left: number, top: number, text: string, id?: number): number {
    if (id !== undefined && this.nodes.some(n => n.id === id)) throw Error('Duplicate ID found: ' + id);
    let node = this.nodeBuilder.create(left, top, text, id);
    this.nodeBuilder.draggable(node);
    this.connBuilder.sourceAction(node);
    this.nodes.push(node);
    return node.id;
  }

  static init(container: SVGSVGElement) {
    Director.instance = new Director(container);
  }
}