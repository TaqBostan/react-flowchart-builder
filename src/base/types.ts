export class Node {
  group: SVGGElement;
  box: SVGRectElement;
  label: SVGTextElement;
  source: SVGRectElement;
  pointer?: SVGPathElement;
  connectors: Connector[] = [];
  constructor(public id: number, public left: number, public top: number, text: string, public width: number = 0, public height: number = 50) {
    let svgns = "http://www.w3.org/2000/svg";
    this.group = document.createElementNS(svgns, 'g') as SVGGElement;
    this.box = document.createElementNS(svgns, 'rect') as SVGRectElement;
    this.label = document.createElementNS(svgns, 'text') as SVGTextElement;
    this.source = document.createElementNS(svgns, 'rect') as SVGRectElement;
    this.group.append(this.box);
    this.box.before(this.label);
    this.group.append(this.source);
  }

  move(left: number, top: number) {
    this.top = top;
    this.left = left;
    this.group.setAttribute('transform', `translate(${left},${top})`);
  }

  center(): Point {
    return {X: this.left + this.width/2, Y: this.top + this.height/2};
  }

  sideCenter(vertical: boolean, firstSide: boolean): Point {
    let center = this.center(), sign = firstSide ? -1 : 1;
    if(vertical) return {X: center.X, Y: center.Y + sign * this.height / 2};
    else return {X: center.X + sign * this.width / 2, Y: center.Y};
  }
}

export type Connector = { id: number, group: SVGGElement, path: SVGPathElement, icon: SVGRectElement, arrow?: SVGPathElement, nextNode: Node, point: Point, slope: number, vertical: boolean, firstSide: boolean, self: boolean, toDest: boolean }

export type Point = { X: number, Y: number }