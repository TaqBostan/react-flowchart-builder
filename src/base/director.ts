import CircleBuilder from "./builders/circle/circ-builder";
import RectBuilder from "./builders/rect/rect-builder";
import RhomBuilder from "./builders/rhom/rhom-builder";
import ConnectorBuilder from "./connector-builder";
import NodeBuilder from "./node-builder";
import { Connector, ConnectorData, Node, Point } from "./types";

export default class Director {
  static instance: Director;
  static sd = { scale: 1 };
  builders: NodeBuilder<Node>[];
  connBuilder: ConnectorBuilder;
  nodes: Node[] = [];
  origin?: Point;

  constructor(public svg: SVGSVGElement) {
    let parent = svg.parentElement!;
    this.connBuilder = new ConnectorBuilder(svg, this.nodes);
    this.builders = [new RectBuilder(svg, this.connBuilder, Director.sd), new CircleBuilder(svg, this.connBuilder, Director.sd), new RhomBuilder(svg, this.connBuilder, Director.sd)];
    parent.onmousedown = (event: MouseEvent) => this.drag_md(event);
    parent.addEventListener('wheel', (e: WheelEvent) => this.mousewheel(e))
  }

  mousewheel(e: WheelEvent) {
    let { clientWidth: w, clientHeight: h, offsetLeft, offsetTop } = (e.currentTarget as HTMLElement)
    let scale = e.deltaY > 0 ? 1.25 : 0.8;
    let left = parseFloat(this.svg.style.left), top = parseFloat(this.svg.style.top);
    this.svg.style.left = (left + (scale - 1) * (w / 2 + left - (e.pageX - offsetLeft))) + 'px';
    this.svg.style.top = (top + (scale - 1) * (h / 2 + top - (e.pageY - offsetTop))) + 'px';
    Director.sd.scale *= scale;
    this.svg.style.transform = `scale(${Director.sd.scale})`
    e.preventDefault();
  }

  drag_md(e: MouseEvent) {
    if (e.button === 0 && !this.origin) {
      let parent = this.svg.parentElement!;
      this.origin = { X: e.clientX, Y: e.clientY };
      parent.onmousemove = (event: MouseEvent) => this.drag_mm(event);
      parent.onmouseup = (event: MouseEvent) => this.drag_mu(event);
    }
  }

  drag_mm(e: MouseEvent) {
    if (e.button === 0 && this.origin) {
      this.svg.style.left = (parseFloat(this.svg.style.left) + (e.clientX - this.origin.X)) + 'px';
      this.svg.style.top = (parseFloat(this.svg.style.top) + (e.clientY - this.origin.Y)) + 'px';
      this.origin = { X: e.clientX, Y: e.clientY };
    }
  }

  drag_mu(e: MouseEvent) {
    if (e.button === 0 && this.origin) {
      this.svg.parentElement!.onmousemove = null;
      this.svg.parentElement!.onmouseup = null;
      this.origin = undefined;
    }
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
      this.connBuilder.connect(destination, connector);
    });
  }

  getData() {
    return {
      nodes: this.nodes.map(n => ({ id: n.id, X: n.left, Y: n.top, text: n.text, shape: n.shape })),
      connectors: this.nodes.reduce(
        (conns: ConnectorData[], node) => [...conns,
        ...node.connectors
          .filter(n => n.toDest)
          .map(conn => {
            let c: ConnectorData = { id: conn.id, from: node.id, to: conn.nextNode.id, text: conn.label?.text, type: conn.type };
            if (!conn.self) {
              if (node.ratio.h !== conn.horizon?.ratioH || node.ratio.v !== conn.horizon.ratioV)
                c.ratioS = [conn.horizon!.ratioH, conn.horizon!.ratioV];
              let _conn = this.connBuilder.getPairConn(conn);
              if (conn.nextNode.ratio.h !== _conn.horizon?.ratioH || conn.nextNode.ratio.v !== _conn.horizon.ratioV)
                c.ratioD = [_conn.horizon!.ratioH, _conn.horizon!.ratioV];
            }
            return c;
          }

          )], [])
    };
  }

  changeConnType(id: number, type: string) {
    this.nodes
      .reduce((conns: Connector[], node) => [...conns, ...node.connectors
        .filter(conn => conn.id === id)], [])
      .forEach(connector => {
        connector.type = type;
        if (connector.arrow) this.connBuilder.setConnType(connector.arrow, type, true);
        this.connBuilder.setConnType(connector.path, type, false);
      });
  }

  addNode(node: Node): number {
    if (node.id !== 0 && this.nodes.some(n => n.id === node.id)) throw Error('Duplicate ID found: ' + node.id);
    let builder = this.getBuilder(node);
    builder.add(node);
    builder.draggable(node);
    builder.clickable(node);
    this.connBuilder.sourceAction(node);
    this.nodes.push(node);
    return node.id;
  }

  static init(container: SVGSVGElement, editable: boolean = false) {
    Director.instance = new Director(container);
    ConnectorBuilder.editable = editable;
  }

  static setScale(scale: number) {
    Director.sd.scale = scale;
  }
}