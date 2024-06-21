
import { Connector, Horizon, Node, Point, Side } from "../../types";

export class RhomNode extends Node {
  box: SVGPolygonElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon') as SVGPolygonElement;
  constructor(public id: number, public left: number, public top: number, public text: string, public diameter: number = 0) {
    super(id, left, top, text, 'rhombus')
  }

  setHorizon(conn: Connector, origin: Point, dest: Point): void {
    if (conn.horizon === undefined) conn.horizon = { point: { X: 0, Y: 0 }, ratioH: 1 / 3, ratioV: 0 };
    let horizontal: number, vertical: number, side = conn.side as RhomSide;
    if(side.vertical) {
      horizontal= (dest.Y - origin.Y) * conn.horizon.ratioH;
      vertical = - horizontal * conn.horizon.ratioV;
      conn.horizon.point.X = origin.X + vertical;
      conn.horizon.point.Y = origin.Y + horizontal;
    }
    else {
      horizontal= (dest.X - origin.X) * conn.horizon.ratioH;
      vertical = horizontal * conn.horizon.ratioV;
      conn.horizon.point.X = origin.X + horizontal;
      conn.horizon.point.Y = origin.Y + vertical;
    }
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

class RhomSide extends Side {
  constructor(public vertical: boolean, public firstSide: boolean) {
    super();
  }
  equal(s: RhomSide): boolean {
    return s.vertical === this.vertical && s.firstSide === this.firstSide;
  }
}