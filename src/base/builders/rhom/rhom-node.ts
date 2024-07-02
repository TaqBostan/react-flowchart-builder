
import { Connector, Horizon, Node, Point, Side } from "../../types";

export class RhomNode extends Node {
  box: SVGPolygonElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon') as SVGPolygonElement;
  ratio = { h: 0.333, v: 0};
  constructor(public id: number, public left: number, public top: number, public text: string, public diameter: number = 0) {
    super(id, left, top, text, 'rhombus')
  }


  updatePoints(p: Point, hrz: Horizon, p2: Point, hrz2: Horizon) {
  }

  center(): Point {
    return { X: this.left + this.diameter / 2, Y: this.top + this.diameter / 2 };
  }

  sideCenter(side: RhomSide): Point {
    let center = this.center(), sign = side.firstSide ? -1 : 1;
    if (side.vertical) return { X: center.X, Y: center.Y + sign * this.diameter / 2 };
    else return { X: center.X + sign * this.diameter / 2, Y: center.Y };
  }

  connSide(node2: Node): RhomSide {
    if (this.id === node2.id) return new RhomSide(true, true);
    let c1 = this.center(), w1 = this.diameter, h1 = this.diameter, c2 = node2.center();
    let vertical = Math.abs(c2.Y - c1.Y) * w1 > Math.abs(c2.X - c1.X) * h1;
    let firstSide = vertical ? (c2.Y < c1.Y) : (c2.X < c1.X);
    return new RhomSide(vertical, firstSide);
  }

  arrangeSide(side: RhomSide) {
    let sideCenter = this.sideCenter(side);
    this.connectors.filter(c => c.side.equal(side)).forEach(c => { c.point = sideCenter; });
  }

  allSides(): Side[] {
    return [new RhomSide(true, true), new RhomSide(true, false), new RhomSide(false, true), new RhomSide(false, false)];
  }
}

export class RhomSide extends Side {
  constructor(public vertical: boolean, public firstSide: boolean) {
    super();
  }
  equal(s: RhomSide): boolean {
    return s.vertical === this.vertical && s.firstSide === this.firstSide;
  }
}