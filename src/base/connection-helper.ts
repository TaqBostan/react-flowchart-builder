import { Point, Node } from './types'

export default class ConnectionHelper {
  static connInfo(a: Point, b: Point) {
    let d = [(b.X - a.X) / 2.5, (b.Y - a.Y) / 2.5], sign = d[0] > 0 ? 1 : -1, v = [sign * d[1] / 5, -sign * d[0] / 5];
    let p1 = [a.X + d[0] + v[0], a.Y + d[1] + v[1]];
    let p2 = [b.X - d[0] + v[0], b.Y - d[1] + v[1]];
    return { path: `M${a.X},${a.Y}C${p1[0]},${p1[1]},${p2[0]},${p2[1]},${b.X},${b.Y}`, curve: sign };
  }
  static iconPoint(a: Point, b: Point): Point {
    let c = [b.X - a.X, b.Y - a.Y], sign = c[0] > 0 ? 1 : -1, v = [sign * c[1] / 16.8, -sign * c[0] / 16.8];
    return { X: a.X + c[0] / 2 + v[0], Y: a.Y + c[1] / 2 + v[1] };
  }

  static roundPath(point: Point): string {
    return `M${point.X - 5},${point.Y}l10-3.5a15,20,0,1,0-10,0l10,3.5`;
  }

  static createConnector(): SVGPathElement {
    let c = document.createElementNS("http://www.w3.org/2000/svg", 'path') as SVGPathElement;
    c.setAttribute("class", "connector");
    c.setAttribute("stroke", "green");
    return c;
  }

  static createIcon(): SVGRectElement {
    let r = document.createElementNS("http://www.w3.org/2000/svg", 'rect') as SVGRectElement;
    r.setAttribute('height', '8');
    r.setAttribute('width', '12');
    r.setAttribute('rx', '2');
    r.setAttribute('fill', 'green');
    r.setAttribute('class', 'grabbable');
    return r;
  }

  static createArrow(): SVGPathElement {
    let a = document.createElementNS("http://www.w3.org/2000/svg", 'path') as SVGPathElement;
    a.setAttribute('fill', 'green');
    a.setAttribute('d', 'M0,0l-9,5v-10l9,5');
    return a;
  }

  static createPointer(): SVGPathElement {
    let p = document.createElementNS("http://www.w3.org/2000/svg", 'path') as SVGPathElement;
    p.setAttribute("class", "connector");
    p.setAttribute("stroke", "green");
    return p;
  }

  static connFacet(node1: Node, node2: Node) {
    if (node1.id === node2.id) return { vertical: true, inOrder: false };
    let c1 = node1.center(), w1 = node1.width, h1 = node1.height,
      c2 = node2.center(), w2 = node2.width, h2 = node2.height;
    let vertical = Math.abs(c2.Y - c1.Y) * (w1 + w2) > Math.abs(c2.X - c1.X) * (h1 + h2);
    let inOrder = vertical ? (c1.Y < c2.Y) : (c1.X < c2.X);
    return { vertical, inOrder };
  }


  static arrangeAllConn(node: Node) {
    this.arrangeConn(node, true, true);
    this.arrangeConn(node, true, false);
    this.arrangeConn(node, false, true);
    this.arrangeConn(node, false, false);
  }

  static arrangeConn(node: Node, vertical: boolean, firstSide: boolean) {
    let sideCenter = node.sideCenter(vertical, firstSide);
    let connectors = node.connectors.filter(c => c.vertical === vertical && c.firstSide === firstSide), count = connectors.length;
    connectors.forEach(c => {
      if (c.self) c.slope = 0;
      else {
        let nextCenter = c.nextNode.sideCenter(vertical, !firstSide), vector = { X: nextCenter.X - sideCenter.X, Y: nextCenter.Y - sideCenter.Y };
        if(vertical) c.slope = vector.Y === 0 ? 1000 * Math.sign(vector.X) : vector.X / vector.Y;
        else c.slope = vector.X === 0 ? 1000 * Math.sign(vector.Y) : vector.Y / vector.X;
      }
    })
    connectors.sort((c1, c2) => firstSide ? (c2.slope - c1.slope) : (c1.slope - c2.slope));
    let dis = Math.min(10, (vertical ? (node.width - 10) / count : (node.height - 10) / count));
    connectors.forEach((connector, i) => {
      connector.point = { ...sideCenter };
      if (vertical) connector.point.X -= ((count - 1) / 2 - i) * dis;
      else connector.point.Y -= ((count - 1) / 2 - i) * dis;
    });
  }
}