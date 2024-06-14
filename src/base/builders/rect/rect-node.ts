
import { Node, Point, Side } from "../../types";

export class RectNode extends Node {
  box: SVGRectElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect') as SVGRectElement;
  constructor(public id: number, public left: number, public top: number, public text: string, public width: number = 0, public height: number = 50) {
    super(id, left, top, text)
  }

  getHorizon(origin: Point, dest: Point): Point {
    let d = [(dest.X - origin.X) / 3, (dest.Y - origin.Y) / 3], sign = d[0] > 0 ? 1 : -1, v = [sign * d[1] / 6, -sign * d[0] / 6];
    return { X: origin.X + d[0] + v[0], Y: origin.Y + d[1] + v[1] };
  }

  center(): Point {
    return { X: this.left + this.width / 2, Y: this.top + this.height / 2 };
  }

  sideCenter(side: RectSide): Point {
    let center = this.center(), sign = side.firstSide ? -1 : 1;
    if (side.vertical) return { X: center.X, Y: center.Y + sign * this.height / 2 };
    else return { X: center.X + sign * this.width / 2, Y: center.Y };
  }

  connSide(node2: Node): RectSide {
    if (this.id === node2.id) return new RectSide(true, true);
    let c1 = this.center(), w1 = this.width, h1 = this.height, c2 = node2.center();
    let vertical = Math.abs(c2.Y - c1.Y) * w1 > Math.abs(c2.X - c1.X) * h1;
    let firstSide = vertical ? (c2.Y < c1.Y) : (c2.X < c1.X);
    return new RectSide(vertical, firstSide);
  }

  arrangeSide(side: RectSide) {
    let sideCenter = this.sideCenter(side);
    let connectors = this.connectors.filter(c => c.side.equal(side)), count = connectors.length;
    connectors.forEach(c => {
      if (c.self) c.slope = 0;
      else {
        let nextCenter = c.nextNode.center(), vector = { X: nextCenter.X - sideCenter.X, Y: nextCenter.Y - sideCenter.Y };
        if (side.vertical) c.slope = vector.Y === 0 ? 1000 * Math.sign(vector.X) : vector.X / vector.Y;
        else c.slope = vector.X === 0 ? 1000 * Math.sign(vector.Y) : vector.Y / vector.X;
      }
    })
    connectors.sort((c1, c2) => side.firstSide ? (c2.slope - c1.slope) : (c1.slope - c2.slope));
    let dis = Math.min(15, (side.vertical ? (this.width - 10) / count : (this.height - 10) / count));
    connectors.forEach((connector, i) => {
      connector.point = { ...sideCenter };
      if (side.vertical) connector.point.X -= ((count - 1) / 2 - i) * dis;
      else connector.point.Y -= ((count - 1) / 2 - i) * dis;
    });
  }
  allSides(): Side[] {
    return [new RectSide(true, true), new RectSide(true, false), new RectSide(false, true), new RectSide(false, false)];
  }
}

class RectSide extends Side {
  constructor(public vertical: boolean, public firstSide: boolean) {
    super();
  }
  equal(s: RectSide): boolean {
    return s.vertical === this.vertical && s.firstSide === this.firstSide;
  }
}