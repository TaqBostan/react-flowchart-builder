import ConnHelper from './connection-helper';
import { Connector, Node, Point, Side, ConnectorData } from './types'

export default class ConnectorBuilder {
  static editable: boolean;
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

  connect(node: Node, connData?: ConnectorData) {
    if (this.sourceNode) {
      let originNode = this.sourceNode, type = (connData?.type) ? connData.type : "solid";
      if (originNode.connectors.some(c => c.nextNode.id === node.id && c.toDest)) return;
      let self = originNode.id === node.id;
      let sideOrigin = originNode.connSide(node);
      let group = document.createElementNS("http://www.w3.org/2000/svg", 'g') as SVGGElement;
      let path = ConnHelper.createConnector(type);
      let arrow = !self ? ConnHelper.createArrow(type) : undefined;
      group.append(path);
      if (!self) group.append(arrow!);
      this.svg.append(group);
      let connLabel = ConnHelper.addLabel(group, ConnectorBuilder.editable, connData?.text);
      let originConn: Connector = {
        id: ++this.maxId,
        group,
        path,
        label: connLabel,
        arrow,
        nextNode: node,
        slope: 0,
        side: sideOrigin,
        self,
        toDest: true,
        type: type,
        selected: false
      }
      if (connData?.ratioS) originConn.horizon = { ratioH: connData.ratioS[0], ratioV: connData.ratioS[1] }
      originNode.connectors.push(originConn);
      if (ConnectorBuilder.editable) this.labelEvent(originNode, originConn);
      originNode.arrangeSide(sideOrigin);
      if (!self) {
        let side = node.connSide(originNode);
        let conn = { ...originConn, nextNode: originNode, side, toDest: !originConn.toDest, point: undefined, pairConn: originConn };
        originConn.pairConn = conn;
        if (connData?.ratioD) conn.horizon = { ratioH: connData.ratioD[0], ratioV: connData.ratioD[1] }
        node.connectors.push(conn);
        node.arrangeSide(side);
        this.updateConn(node, side);
      }
      this.updateConn(originNode, sideOrigin);
    }
  }

  labelEvent(node: Node, conn: Connector) {
    conn.label!.g.onmousedown = (event: MouseEvent) => this.label_md(event, node, conn);
    conn.label!.g.ondblclick = () => this.label_dc(node, conn);
    conn.label!.g.onclick = () => this.label_c(conn);
  }

  label_dc(node: Node, conn: Connector) {
    conn.label!.g.onmousedown = conn.label!.g.ondblclick = null;
    let lbl = conn.label!, width = lbl.elem.getBBox().width + 14, height = 17;
    lbl.elem.setAttribute('visibility', 'hidden');
    lbl.box.setAttribute('width', (width + 2).toString());
    lbl.box.setAttribute('height', (height + 2).toString());
    let { foreign, input } = ConnHelper.createLabelInput(width, height, lbl.text);
    lbl.g.append(foreign);
    input.focus();
    input.oninput = () => {
      lbl.elem.textContent = input.value;
      input.style.width = (lbl.elem.getBBox().width + 14) + "px";
      foreign.setAttribute("width", `${input.offsetWidth}`);
      lbl.box.setAttribute('width', `${input.offsetWidth + 2}`);
    }
    input.onblur = () => {
      lbl.text = input.value;
      foreign.remove();
      lbl.g.remove()
      let connLabel = ConnHelper.addLabel(conn.group, ConnectorBuilder.editable, lbl.text);
      Object.assign(lbl, connLabel);
      this.updateAllConn(node);
      this.labelEvent(node, conn);
    }
    input.onkeyup = (e: KeyboardEvent) => {
      if (e.key === 'Enter') input.onblur?.(new FocusEvent('blur'));
    }
  }

  label_c(conn: Connector) {
    this.unselect();
    if (!conn.self) {
      this.createHorizonDisc(conn);
      this.createHorizonDisc(conn.pairConn!);
    }
    this.select(conn, true);
  }

  createHorizonDisc(conn: Connector) {
    let disc = ConnHelper.createHorizonDisc(conn.horizon!.point!);
    conn.horizon!.elem = disc;
    this.svg.append(disc);
  }

  select(conn: Connector, is: boolean) {
    conn.selected = is;
    conn.path.setAttribute('stroke', is ? 'green' : conn.type === 'solid' ? 'black' : 'gray');
    conn.path.setAttribute('stroke-width', is ? '2' : '1');
    conn.path.setAttribute('filter', is ? 'url(#flt)' : '');
    conn.arrow?.setAttribute('fill', is ? 'green' : conn.type === 'solid' ? 'black' : 'gray');
  }

  unselect() {
    this.nodes
      .reduce((conns: Connector[], node) => [...conns, ...node.connectors], [])
      .filter(conn => conn.selected)
      .forEach(conn => {
        this.select(conn, false);
        if (!conn.self) {
          let _conn = conn.pairConn!;
          _conn.horizon!.elem!.remove();
          _conn.horizon!.elem = undefined;
          conn.horizon!.elem!.remove();
          conn.horizon!.elem = undefined;
        }
      });
  }


  label_md(e: MouseEvent, node: Node, connector: Connector) {
    if (e.button === 0 && !this.origin) {
      this.origin = { X: e.offsetX, Y: e.offsetY };
      this.sourceNode = node;
      this.connector = connector;
      this.svg.onmousemove = (event: MouseEvent) => this.label_mm(event);
      this.svg.onmouseup = (event: MouseEvent) => this.label_mu(event);
      e.stopPropagation();
    }
  }

  label_mm(e: MouseEvent) {
    if (e.button === 0 && this.origin) {
      let tran = `translate(${e.offsetX - this.origin.X},${e.offsetY - this.origin.Y})`;
      let { group, path, arrow, horizon } = this.connector!;
      let _horizon = this.connector!.pairConn?.horizon;
      let color = Math.abs(e.offsetX - this.origin.X) + Math.abs(e.offsetY - this.origin.Y) > 40 ? 'red' : 'green';
      group.setAttribute('transform', tran);
      horizon?.elem?.setAttribute('transform', tran);
      _horizon?.elem?.setAttribute('transform', tran);
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
        this.connector.horizon?.elem?.remove();
        this.connector.pairConn?.horizon?.elem?.remove();
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
      this.sourceNode!.pointer!.setAttribute('d', ConnHelper.pointerInfo(this.origin, { X: e.offsetX, Y: e.offsetY }).path);
  }

  updateAllConn(node: Node) {
    node.allSides().forEach(s => this.updateConn(node, s));
  }

  updateConn(node: Node, side: Side) {
    node.connectors.filter(c => c.side.equal(side)).forEach(connector => {
      let p1 = connector.point!;
      let pathD: string, labelPoint: Point;
      if (connector.self) {
        pathD = ConnHelper.roundPath(p1);
        labelPoint = { X: p1.X, Y: p1.Y - 43 };
      }
      else {
        let p2 = connector.pairConn!.point!
        node.setHorizon(connector, p1, p2);
        connector.nextNode.setHorizon(connector.pairConn!, p2, p1);
        let h1 = connector.horizon!, hPoint1 = h1.point!;
        let h2 = connector.pairConn!.horizon!, hPoint2 = h2.point!;
        node.updatePoints(p1, h1, p2, h2);
        h1.elem?.setAttribute("x", hPoint1.X.toString());
        h1.elem?.setAttribute("y", hPoint1.Y.toString());
        pathD = ConnHelper.connInfo(p1, p2, hPoint1, hPoint2);
        let phi = connector.toDest ? Math.atan2(p2.Y - hPoint2.Y, p2.X - hPoint2.X) : Math.atan2(p1.Y - hPoint1.Y, p1.X - hPoint1.X);
        let dest = connector.toDest ? p2 : p1;
        connector.arrow!.setAttribute('transform', `translate(${dest.X},${dest.Y}) rotate(${phi * 180 / Math.PI})`);
        labelPoint = { X: (p1.X + 3 * hPoint1.X + 3 * hPoint2.X + p2.X) / 8, Y: (p1.Y + 3 * hPoint1.Y + 3 * hPoint2.Y + p2.Y) / 8 };
      }
      let lbl = connector.label;
      lbl?.g.setAttribute('transform', `translate(${labelPoint.X - lbl.size.X / 2},${labelPoint.Y - lbl.size.Y / 2})`);
      connector.path.setAttribute('d', pathD);
    });
  }

  setConnType(conn: Connector, type: string) {
    ConnHelper.setArrow(conn.arrow!, type)
    ConnHelper.setPath(conn.path, type)
  }
}