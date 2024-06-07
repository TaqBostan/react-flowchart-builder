import { Point, Node } from './types'

export default class ConnectionHelper {
  static connInfo(a: Point, b: Point) {
    let d = [(b.X - a.X) / 2.5, (b.Y - a.Y) / 2.5], sign = d[0] > 0 ? 1 : -1, v = [sign * d[1] / 5, -sign * d[0] / 5];
    let p1 = [a.X + d[0] + v[0], a.Y + d[1] + v[1]];
    let p2 = [b.X - d[0] + v[0], b.Y - d[1] + v[1]];
    return { path: `M${a.X},${a.Y}C${p1[0]},${p1[1]},${p2[0]},${p2[1]},${b.X},${b.Y}`, curve: sign };
  }
  
  static labelPoint(a: Point, b: Point): Point {
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

  static addLabel(text: string, container: SVGGElement) {
    let g = document.createElementNS("http://www.w3.org/2000/svg", 'g') as SVGGElement;
    let txt = document.createElementNS("http://www.w3.org/2000/svg", 'text') as SVGTextElement;
    let box = document.createElementNS("http://www.w3.org/2000/svg", 'rect') as SVGRectElement;
    txt.innerHTML = text;
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('class', 'grabbable label-text');

    box.setAttribute('rx', '3');
    box.setAttribute('ry', '3');
    box.setAttribute('class', 'grabbable label-box');

    g.append(box, txt);
    container.append(g);

    let bbox = txt.getBBox();
    let width = Math.max(bbox.width, 14);
    let size: Point = { X: width + 6, Y: bbox.height + 4 };
    txt.setAttribute('x', (width / 2 + 3).toString());
    txt.setAttribute('y', (bbox.height - 1).toString());
    box.setAttribute('height', size.Y.toString());
    box.setAttribute('width', size.X.toString());

    return { g, size };
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
}