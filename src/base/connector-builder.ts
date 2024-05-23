import ConnHelper from './connection-helper';
import { Connector, Node, Point } from './types'

export default class ConnectorBuilder {
  maxId: number = 0;
  origin?: Point;
  sourceNode?: Node;
  connector?: Connector;

  constructor(public svg: SVGSVGElement, public nodes: Node[]) {
  }

  sourceAction(node: Node) {
    node.source.onmousedown = (event: MouseEvent) => this.source_md(event, node);
  }

  source_md(e: MouseEvent, node: Node) {
    if (e.button === 0 && !this.origin) {
      this.origin = { X: node.left + node.source.getBBox().x + 6, Y: node.top + node.source.getBBox().y + 6 };
      this.sourceNode = node;
      this.sourceNode.pointer = ConnHelper.createPointer();
      this.nodes[0].group.before(this.sourceNode.pointer!);
      this.svg.onmousemove = (event: MouseEvent) => this.source_mm(event);
      this.svg.onmouseup = (event: MouseEvent) => this.source_mu(event);
      this.nodes.forEach(n => {
        n.box.setAttribute('class', 'connectable');
        n.box.onmouseup = () => this.connect(n);
      });
      e.stopPropagation();
    }
  }

  connect(node: Node) {
    if (this.sourceNode) {
      let originNode = this.sourceNode;
      if (originNode.connectors.some(c => c.nextNode.id === node.id && c.toDest)) return;
      let self = originNode.id === node.id;
      let connFacet = ConnHelper.connFacet(originNode, node);
      let path = ConnHelper.createConnector();
      let icon = ConnHelper.createIcon();
      let arrow = !self ? ConnHelper.createArrow() : undefined;
      let group = document.createElementNS("http://www.w3.org/2000/svg", 'g') as SVGGElement;
      let originConn: Connector = {
        id: ++this.maxId,
        group,
        path,
        icon,
        arrow,
        nextNode: node,
        point: { X: 0, Y: 0 },
        slope: 0,
        vertical: connFacet.vertical,
        firstSide: self ? true : !connFacet.inOrder,
        self,
        toDest: true
      }
      originNode.connectors.push(originConn);
      icon.onmousedown = (event: MouseEvent) => this.icon_md(event, originNode, originConn);
      ConnHelper.arrangeConn(originNode, connFacet.vertical, !connFacet.inOrder);
      if (!self) {
        let conn = { ...originConn, nextNode: originNode, point: { X: 0, Y: 0 }, firstSide: !originConn.firstSide, toDest: !originConn.toDest }
        node.connectors.push(conn);
        ConnHelper.arrangeConn(node, connFacet.vertical, connFacet.inOrder);
        this.updateConn(node, connFacet.vertical, connFacet.inOrder);
      }
      this.updateConn(originNode, connFacet.vertical, !connFacet.inOrder);
      group.append(path, icon);
      if (!self) group.append(arrow!);
      this.svg.append(group);
    }
  }

  icon_md(e: MouseEvent, node: Node, connector: Connector) {
    if (e.button === 0 && !this.origin) {
      this.origin = { X: e.offsetX, Y: e.offsetY };
      this.sourceNode = node;
      this.connector = connector;
      this.svg.onmousemove = (event: MouseEvent) => this.icon_mm(event);
      this.svg.onmouseup = (event: MouseEvent) => this.icon_mu(event);
    }
  }

  icon_mm(e: MouseEvent) {
    if (e.button === 0 && this.origin) {
      let tran = `translate(${e.offsetX - this.origin.X},${e.offsetY - this.origin.Y})`;
      let { group, path, arrow } = this.connector!;
      let color = Math.abs(e.offsetX - this.origin.X) + Math.abs(e.offsetY - this.origin.Y) > 40 ? 'red' : 'green';
      group.setAttribute('transform', tran);
      path.setAttribute('stroke', color);
      arrow?.setAttribute('fill', color);
    }
  }

  icon_mu(e: MouseEvent) {
    if (e.button === 0 && this.origin && this.connector) {
      if (Math.abs(e.offsetX - this.origin.X) + Math.abs(e.offsetY - this.origin.Y) > 40) {
        let index1 = this.sourceNode!.connectors.findIndex(c => c.id === this.connector?.id)!;
        this.sourceNode!.connectors.splice(index1, 1);
        if (!this.connector.self) {
          let index2 = this.connector.nextNode.connectors.findIndex(c => c.id === this.connector?.id)!;
          this.connector.nextNode.connectors.splice(index2, 1);
        }
        this.connector.group.remove();
      }
      else this.connector.group.removeAttribute('transform');
      this.svg.onmousemove = null;
      this.svg.onmouseup = null;
      this.origin = undefined;
      this.sourceNode = undefined;
      this.connector = undefined;
    }
  }

  source_mu(e: MouseEvent) {
    if (e.button === 0 && this.origin) {
      this.sourceNode!.pointer!.remove();
      this.svg.onmousemove = null;
      this.svg.onmouseup = null;
      this.origin = undefined;
      this.sourceNode = undefined;
      this.nodes.forEach(n => {
        n.box.setAttribute('class', 'grabbable');
        n.box.onmouseup = null;
      });
    }
  }

  source_mm(e: MouseEvent) {
    if (e.button === 0 && this.origin)
      this.sourceNode!.pointer!.setAttribute('d', ConnHelper.connInfo(this.origin, { X: e.offsetX, Y: e.offsetY }).path);
  }

  updateAllConn(node: Node) {
    this.updateConn(node, true, true);
    this.updateConn(node, true, false);
    this.updateConn(node, false, true);
    this.updateConn(node, false, false);
  }

  updateConn(node: Node, vertical: boolean, firstSide: boolean) {
    node.connectors.filter(c => c.vertical === vertical && c.firstSide === firstSide).forEach(connector => {
      let p1 = connector.point, p2 = connector.nextNode.connectors.find(c => c.id === connector.id)!.point;
      let pathD: string;
      if (connector.self) pathD = ConnHelper.roundPath(p1);
      else {
        let { path, curve } = ConnHelper.connInfo(p1, p2);
        pathD = path;
        let origin = connector.toDest ? p1 : p2, dest = connector.toDest ? p2 : p1;
        let fi = Math.atan2(dest.Y - origin.Y, dest.X - origin.X) * 180 / Math.PI + curve * (connector.toDest ? 1 : -1) * 10;
        connector.arrow!.setAttribute('transform', `translate(${dest.X},${dest.Y}) rotate(${fi})`);
      }
      let p: Point = connector.self ? { X: p1.X, Y: p1.Y - 42 } : ConnHelper.iconPoint(p1, p2);
      connector.icon.setAttribute('x', (p.X - 6).toString());
      connector.icon.setAttribute('y', (p.Y - 4).toString());
      connector.path.setAttribute('d', pathD);
    });
  }
}