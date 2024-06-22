
import ConnectorBuilder from './connector-builder';
import { Node, Point } from './types'

export default abstract class NodeBuilder<N extends Node> {
  static maxId: number = 0;
  origin?: Point;
  node?: Node;
  abstract ofType<T extends Node>(node: T): boolean;
  abstract setSize(n: Node): void;

  constructor(public svg: SVGSVGElement, public connBuilder: ConnectorBuilder) {
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

    n.label.setAttribute('x', '7');
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
    return n;
  }

  draggable(node: Node) {
    node.group.onmousedown = (event: MouseEvent) => this.node_md(event, node);
  }

  node_md(e: MouseEvent, node: Node) {
    if (e.button === 0 && !this.origin) {
      this.origin = { X: e.clientX, Y: e.clientY };
      this.node = node;
      this.svg.onmousemove = (event: MouseEvent) => this.node_mm(event);
      node.group.onmouseup = (event: MouseEvent) => this.node_mu(event);
    }
  }

  node_mm(e: MouseEvent) {
    if (e.button === 0 && this.origin && this.node) {
      this.node.move(this.node.left + e.clientX - this.origin.X, this.node.top + e.clientY - this.origin.Y);
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