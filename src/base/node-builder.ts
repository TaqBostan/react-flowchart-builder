
import ConnHelper from './connection-helper';
import ConnectorBuilder from './connector-builder';
import { Node, Point } from './types'

export default class NodeBuilder {
  maxId: number = 0;
  origin?: Point;
  node?: Node;
  
  constructor(public svg: SVGSVGElement, public connBuilder: ConnectorBuilder) {
  }

  create(left: number, top: number, text: string, id?: number): Node {
    if(id === undefined) id = ++this.maxId;
    else if(id > this.maxId) this.maxId = id;
    let n = new Node(id, left, top, text);
    this.svg.append(n.group);
    n.group.setAttribute('transform', `translate(${left},${top})`);
    n.box.setAttribute('class', 'grabbable');
    n.box.setAttribute('x', '0');
    n.box.setAttribute('y', '0');
    n.box.setAttribute('height', n.height.toString());
    n.box.setAttribute('stroke', 'black');
    n.box.setAttribute('stroke-width', '1');
    n.box.setAttribute('rx', '5');
    n.box.setAttribute('fill', 'transparent');

    n.label.setAttribute('x', '10');
    n.label.setAttribute('fill', 'black');
    n.label.setAttribute('font-size', '16');
    n.label.setAttribute('font-family', 'arial,sans-serif');
    n.label.setAttribute('class', 'no-select');
    n.label.innerHTML = text;
    n.label.setAttribute('y', (21.5 + n.label.getBBox().height / 2).toString());
    n.width = 20 + Math.max(20, n.label.getBBox().width);
    n.box.setAttribute('width', n.width.toString());

    n.source.setAttribute('class', 'source pointer');
    n.source.setAttribute('x', (n.width - 20).toString());
    n.source.setAttribute('y', '19.5');
    n.source.setAttribute('height', '12');
    n.source.setAttribute('width', '12');
    n.source.setAttribute('stroke', 'black');
    n.source.setAttribute('stroke-width', '0.5');
    n.source.setAttribute('rx', '3');
    n.source.setAttribute('fill', 'orange');

    return n;
  }

  draggable(node: Node) {
    node.group.onmousedown = (event: MouseEvent) => this.node_md(event, node);
  }

  node_md(e: MouseEvent, node: Node) {
    if (e.button === 0 && !this.origin) {
      this.origin = { X: e.clientX, Y: e.clientY };
      this.node = node;
      this.svg.onmousemove = (event: MouseEvent) =>this.node_mm(event);
      node.group.onmouseup = (event: MouseEvent) => this.node_mu(event);
    }
  }

  node_mm(e: MouseEvent) {
    if (e.button === 0 && this.origin &&this.node) {
      this.node.move(this.node.left + e.clientX - this.origin.X, this.node.top + e.clientY - this.origin.Y);
      this.node.connectors.forEach(connector => {
        let connFacet = ConnHelper.connFacet(this.node!, connector.nextNode);
        connector.vertical = connFacet.vertical;
        connector.firstSide = connector.self ? true : !connFacet.inOrder;
        if(!connector.self) {
          let connector2 = connector.nextNode.connectors.find(c => c.id === connector.id)!;
          connector2.vertical = connFacet.vertical;
          connector2.firstSide = connFacet.inOrder;
        }
        ConnHelper.arrangeConn(connector.nextNode, connFacet.vertical, connFacet.inOrder);
        this.connBuilder.updateConn(connector.nextNode, connFacet.vertical, connFacet.inOrder);
      });
      ConnHelper.arrangeAllConn(this.node);
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