import { Point } from './types'

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
    let { X, Y } = point;
    return `M${X},${Y}l5-5a12,20,0,1,0-10,0l5,5M${X - 6.5},${Y - 35}l-5,6l-1-7.8M${X + 6.5},${Y - 12}l5-6l1+7.8`;
  }

  static createConnector(type: string): SVGPathElement {
    let c = document.createElementNS("http://www.w3.org/2000/svg", 'path') as SVGPathElement;
    c.setAttribute("class", "connector");
    this.setStroke(c, type);
    return c;
  }
  static createLabelInput(width: number, height: number, text: string | undefined) {
    let f = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject') as SVGForeignObjectElement;
    let div = document.createElement('div');
    let input = document.createElement('input');
    f.setAttribute("width", `${width}`);
    f.setAttribute("height", `${height}`);
    f.setAttribute("x", "1");
    f.setAttribute("y", "1");
    div.setAttribute("xmlns", 'http://www.w3.org/1999/xhtml');
    if(text) input.value = text;
    input.setAttribute("class", 'lbl-input');
    input.style.width = width + "px";
    div.append(input);
    f.append(div);
    return {foreign: f, input};
  }

  static setStroke(path: SVGPathElement, type: string) {
    if (type === 'solid') {
      path.setAttribute("stroke", "green");
      path.removeAttribute("stroke-dasharray");
    }
    else if (type === 'dashed') {
      path.setAttribute("stroke-dasharray", "6");
      path.setAttribute("stroke", "gray");
    }
  }

  static addLabel(container: SVGGElement, editable: boolean, text?: string) {
    if (!editable && !text) return undefined;
    let g = document.createElementNS("http://www.w3.org/2000/svg", 'g') as SVGGElement;
    let elem = document.createElementNS("http://www.w3.org/2000/svg", 'text') as SVGTextElement, size: Point;

    let box = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    box.setAttribute('rx', '3');
    box.setAttribute('ry', '3');
    box.classList.add('lbl-box');
    if (editable) box.classList.add('grabbable');

    g.append(box);
    container.append(g);

    elem.setAttribute('text-anchor', 'middle');
    elem.classList.add('lbl-text');
    g.append(elem);

    if (text) {
      elem.innerHTML = text;
      if (editable) elem.classList.add('grabbable');
      let bbox = elem.getBBox();
      let width = Math.max(bbox.width, 14);
      size = { X: width + 6, Y: bbox.height + 4 };
      elem.setAttribute('x', (width / 2 + 3).toString());
      elem.setAttribute('y', (bbox.height - 1).toString());
    }
    else {
      elem.setAttribute('visibility', 'hidden');
      size = { X: 12, Y: 8 };
  }

    box?.setAttribute('height', size.Y.toString());
    box?.setAttribute('width', size.X.toString());

    return { g, box, size, text, elem };
  }

  static createArrow(type: string): SVGPathElement {
    let a = document.createElementNS("http://www.w3.org/2000/svg", 'path') as SVGPathElement;
    this.setArrow(a, type);
    a.setAttribute('d', 'M0,0l-9,5v-10l9,5');
    return a;
  }

  static setArrow(path: SVGPathElement, type: string) {
    if (type === 'solid')
      path.setAttribute('fill', 'green');
    else if (type === 'dashed')
      path.setAttribute('fill', 'gray');
  }

  static createPointer(): SVGPathElement {
    let p = document.createElementNS("http://www.w3.org/2000/svg", 'path') as SVGPathElement;
    p.setAttribute("class", "connector");
    p.setAttribute("stroke", "green");
    return p;
  }
}