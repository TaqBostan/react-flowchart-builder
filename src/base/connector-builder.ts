import ConnHelper from './connection-helper';
import { Connector, Node, Point, Side } from './types'

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

  connect(node: Node, label?: string) {
    if (this.sourceNode) {
      let originNode = this.sourceNode;
      if (originNode.connectors.some(c => c.nextNode.id === node.id && c.toDest)) return;
      let self = originNode.id === node.id;
      let sideOrigin = originNode.connSide(node);
      let group = document.createElementNS("http://www.w3.org/2000/svg", 'g') as SVGGElement;
      let path = ConnHelper.createConnector();
      let arrow = !self ? ConnHelper.createArrow() : undefined;
      group.append(path);
      if (!self) group.append(arrow!);
      this.svg.append(group);
      let id = ++this.maxId;
      let connLabel = ConnHelper.addLabel(label || ('conn_' + id), group);
      let originConn: Connector = {
        id,
        group,
        path,
        label: connLabel,
        arrow,
        nextNode: node,
        point: { X: 0, Y: 0 },
        slope: 0,
        side: sideOrigin,
        self,
        toDest: true
      }
      originNode.connectors.push(originConn);
      connLabel.g.onmousedown = (event: MouseEvent) => this.label_md(event, originNode, originConn);
      originNode.arrangeSide(sideOrigin);
      if (!self) {
        let side = node.connSide(originNode);
        let conn = { ...originConn, nextNode: originNode, point: { X: 0, Y: 0 }, side, toDest: !originConn.toDest }
        node.connectors.push(conn);
        node.arrangeSide(side);
        this.updateConn(node, side);
      }
      this.updateConn(originNode, sideOrigin);
    }
  }

  label_md(e: MouseEvent, node: Node, connector: Connector) {
    if (e.button === 0 && !this.origin) {
      this.origin = { X: e.offsetX, Y: e.offsetY };
      this.sourceNode = node;
      this.connector = connector;
      this.svg.onmousemove = (event: MouseEvent) => this.label_mm(event);
      this.svg.onmouseup = (event: MouseEvent) => this.label_mu(event);
    }
  }

  label_mm(e: MouseEvent) {
    if (e.button === 0 && this.origin) {
      let tran = `translate(${e.offsetX - this.origin.X},${e.offsetY - this.origin.Y})`;
      let { group, path, arrow } = this.connector!;
      let color = Math.abs(e.offsetX - this.origin.X) + Math.abs(e.offsetY - this.origin.Y) > 40 ? 'red' : 'green';
      group.setAttribute('transform', tran);
      path.setAttribute('stroke', color);
      arrow?.setAttribute('fill', color);
    }
  }

  label_mu(e: MouseEvent) {
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
    node.allSides().forEach(s => this.updateConn(node, s));
  }

  updateConn(node: Node, side: Side) {
    node.connectors.filter(c => c.side.equal(side)).forEach(connector => {
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
      let p: Point = connector.self ? { X: p1.X, Y: p1.Y - 42 } : ConnHelper.labelPoint(p1, p2), lbl = connector.label;
      lbl.g.setAttribute('transform',`translate(${p.X - lbl.size.X / 2},${p.Y - lbl.size.Y / 2})`);
      connector.path.setAttribute('d', pathD);
    });
  }
}