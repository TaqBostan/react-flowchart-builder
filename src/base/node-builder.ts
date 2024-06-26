
import ConnectorBuilder from './connector-builder';
import { Node, Point, StaticData } from './types'

export default abstract class NodeBuilder<N extends Node> {
  static maxId: number = 0;
  origin?: Point;
  node?: Node;
  nodes: Node[];
  abstract ofType<T extends Node>(node: T): boolean;
  abstract setSize(n: Node): void;

  constructor(public svg: SVGSVGElement, public connBuilder: ConnectorBuilder, public sd: StaticData) {
    this.nodes = this.connBuilder.nodes
  }

  add(n: Node): Node {
    if (n.id === 0) n.id = ++NodeBuilder.maxId;
    else if (n.id > NodeBuilder.maxId) NodeBuilder.maxId = n.id;
    n.grouping();
    this.svg.append(n.group);
    n.group.setAttribute('transform', `translate(${n.left},${n.top})`);
    n.box.setAttribute('class', 'grabbable');
    n.box.setAttribute('stroke', 'black');
    n.box.setAttribute('stroke-width', '1');
    n.box.setAttribute('fill', 'transparent');

    n.label.setAttribute('text-anchor', 'middle');
    n.label.setAttribute('class', 'no-select node-txt');
    n.label.innerHTML = n.text;

    if (ConnectorBuilder.editable) {
      n.source.setAttribute('class', 'source pointer');
      n.source.setAttribute('height', '12');
      n.source.setAttribute('width', '12');
      n.source.setAttribute('stroke', 'black');
      n.source.setAttribute('stroke-width', '0.5');
      n.source.setAttribute('rx', '3');
      n.source.setAttribute('fill', 'orange');
    }

    this.setSize(n);
    n.label.setAttribute('x', ((n.box as any).getBBox().width / 2 - 1).toString());

    return n;
  }

  draggable(node: Node) {
    node.group.onmousedown = (event: MouseEvent) => this.node_md(event, node);
  }

  clickable(node: Node) {
    node.group.onclick = (event: MouseEvent) => this.node_c(event, node);
  }

  node_c(e: MouseEvent, node: Node) {
    this.node = node;
    this.nodes.filter(n => n.selected).forEach(n => this.select(n, false));
    this.select(node, true);
    e.stopPropagation();
  }

  select(n: Node, is: boolean) {
    n.selected = is;
    n.box.setAttribute('stroke', is ? 'green' : 'black');
    n.box.setAttribute('stroke-width', is ? '2' : '1');
    n.box.setAttribute('filter', is ? 'url(#flt)' : '');
  }

  node_md(e: MouseEvent, node: Node) {
    if (e.button === 0 && !this.origin) {
      this.origin = { X: e.clientX, Y: e.clientY };
      this.node = node;
      this.svg.parentElement!.onmousemove = (event: MouseEvent) => this.node_mm(event);
      node.group.onmouseup = (event: MouseEvent) => this.node_mu(event);
      e.stopPropagation();
    }
  }

  node_mm(e: MouseEvent) {
    if (e.button === 0 && this.origin && this.node) {
      this.node.move(this.node.left + (e.clientX - this.origin.X) / this.sd.scale, this.node.top + (e.clientY - this.origin.Y) / this.sd.scale);
      this.node.connectors.forEach(connector => {
        connector.side = this.node!.connSide(connector.nextNode);
        if (!connector.self) {
          let side2 = connector.nextNode.connSide(this.node!);
          let connector2 = connector.nextNode.connectors.find(c => c.id === connector.id)!;
          connector2.side = side2;
          connector.nextNode.arrangeSide(side2);
          this.connBuilder.updateConn(connector.nextNode, side2);
        }
      });
      this.node.arrangeSides();
      this.connBuilder.updateAllConn(this.node);
      this.origin = { X: e.clientX, Y: e.clientY };
    }
  }

  node_mu(e: MouseEvent) {
    if (e.button === 0 && this.origin) {
      this.svg.onmousemove = null;
      this.node!.group.onmouseup = null;
      this.origin = undefined;
      this.node = undefined;
    }
  }
}