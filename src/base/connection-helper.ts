import { Point, Node } from './types'

export default class ConnectionHelper {
  static connInfo(a: Point, b: Point, h1: Point, h2: Point) {
    return `M${a.X},${a.Y}C${h1.X},${h1.Y},${h2.X},${h2.Y},${b.X},${b.Y}`;
  }

  static pointerInfo(a: Point, b: Point) {
    let d = [(b.X - a.X) / 2.5, (b.Y - a.Y) / 2.5], sign = d[0] > 0 ? 1 : -1, v = [sign * d[1] / 5, -sign * d[0] / 5];
    let p1 = [a.X + d[0] + v[0], a.Y + d[1] + v[1]];
    let p2 = [b.X - d[0] + v[0], b.Y - d[1] + v[1]];
    return { path: `M${a.X},${a.Y}C${p1[0]},${p1[1]},${p2[0]},${p2[1]},${b.X},${b.Y}`, curve: sign };
  }

  static roundPath(point: Point): string {
    let {X, Y} = point;
    return `M${X},${Y}l5-5a12,20,0,1,0-10,0l5,5M${X - 8},${Y - 27}l-4,7l-4-7M${X + 8},${Y -20}l4-7l4,7`;
  }

  static createConnector(): SVGPathElement {
    let c = document.createElementNS("http://www.w3.org/2000/svg", 'path') as SVGPathElement;
    c.setAttribute("class", "connector");
    c.setAttribute("stroke", "green");
    return c;
  }

  static addLabel(container: SVGGElement, editable: boolean, text?: string) {
    let g = document.createElementNS("http://www.w3.org/2000/svg", 'g') as SVGGElement;
    let txt: SVGTextElement, size: Point, box: SVGRectElement | undefined;
    
    if(editable || text) {
      box = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
      box.setAttribute('rx', '3');
      box.setAttribute('ry', '3');
      box.classList.add('label-box');
      if (editable) box.classList.add('grabbable');
      g.append(box);
    }

    container.append(g);

    if(text) {
      txt = document.createElementNS("http://www.w3.org/2000/svg", 'text') as SVGTextElement;
      txt.innerHTML = text;
      txt.setAttribute('text-anchor', 'middle');
      txt.classList.add('label-text');
      if (editable) txt.classList.add('grabbable');
      g.append(txt);
      let bbox = txt.getBBox();
      let width = Math.max(bbox.width, 14);
      size = { X: width + 6, Y: bbox.height + 4 };
      txt.setAttribute('x', (width / 2 + 3).toString());
      txt.setAttribute('y', (bbox.height - 1).toString());
    }
    else if(editable) size = { X: 12, Y: 8 };
    else size = { X: 0, Y: 0 };

    box?.setAttribute('height', size.Y.toString());
    box?.setAttribute('width', size.X.toString());

    return { g, size, text };
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