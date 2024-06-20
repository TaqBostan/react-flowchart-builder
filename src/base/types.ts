let svgns = "http://www.w3.org/2000/svg";
export abstract class Node {
  group: SVGGElement = document.createElementNS(svgns, 'g') as SVGGElement;
  label: SVGTextElement = document.createElementNS(svgns, 'text') as SVGTextElement;
  source: SVGRectElement = document.createElementNS(svgns, 'rect') as SVGRectElement;
  abstract box: SVGElement;
  pointer?: SVGPathElement;
  connectors: Connector[] = [];
  abstract center(): Point;
  abstract allSides(): Side[];
  abstract connSide(node2: Node): Side;
  abstract arrangeSide(side: Side): void;
  abstract getHorizon(prevHrz: Horizon | undefined, origin: Point, dest: Point): Horizon;
  abstract updatePoints(p: Point, hrz: Horizon, p2: Point, hrz2: Horizon): void;
  constructor(public id: number, public left: number, public top: number, public text: string) {
  }

  arrangeSides() {
    this.allSides().forEach(s => this.arrangeSide(s));
  }

  grouping() {
    this.group.append(this.box);
    this.box.before(this.label);
    this.group.append(this.source);
  }

  move(left: number, top: number) {
    this.top = top;
    this.left = left;
    this.group.setAttribute('transform', `translate(${left},${top})`);
  }
}

export abstract class Side {
  abstract equal(s: Side): boolean;
}

export type NodeData = { id?: number, X: number, Y: number, text: string, shape?: string }

export type Horizon = { point: Point, ratioH: number, ratioV: number }

export type Connector = {
  id: number,
  group: SVGGElement,
  path: SVGPathElement,
  label: { g: SVGGElement, size: Point },
  arrow?: SVGPathElement,
  nextNode: Node,
  point?: Point,
  horizon?: Horizon,
  slope: number,
  side: Side,
  self: boolean,
  toDest: boolean
}

export type ConnectorData = { from: number, to: number, text?: string }

export type Point = { X: number, Y: number }