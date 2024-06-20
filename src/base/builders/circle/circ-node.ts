
import { Horizon, Node, Point, Side } from "../../types";
import Util from "../../util";

export class CircleNode extends Node {
  box: SVGCircleElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle') as SVGCircleElement;
  constructor(public id: number, public left: number, public top: number, public text: string, public radius: number = 0) {
    super(id, left, top, text)
  }

  getHorizon(prevHrz: Horizon | undefined, origin: Point, dest: Point): Horizon {
    if (prevHrz !== undefined) return prevHrz;
    let distance = Math.sqrt(Math.pow(dest.X - origin.X, 2) + Math.pow(dest.Y - origin.Y, 2)), center = this.center(),
      vector = [origin.X - center.X, origin.Y - center.Y];
    let point = { X: origin.X + vector[0] * distance / this.radius / 3, Y: origin.Y + vector[1] * distance / this.radius / 3 };
    return { point, ratioH: 0, ratioV: 0 }
  }

  updatePoints(p: Point, hrz: Horizon, p2: Point, hrz2: Horizon) {
    let center = this.center(), hPoint = hrz.point, hPoint2 = hrz2.point, phi: number, sign = p2.X < p.X ? 1 : -1;
    if (hrz.ratioH === 0) {
      hrz.ratioH = 1 / 3;
      let v1 = [p2.X - center.X, p2.Y - center.Y], v2 = [hPoint2.X - center.X, hPoint2.Y - center.Y], v1v2 = v1[0] * v2[1] - v1[1] * v2[0];
      let l1 = Util.len(v1), l2 = Util.len(v2);
      phi = l1 > 0 && l2 > 0 ? sign * Math.asin(v1v2 / l1 / l2) : 0;
      hrz.ratioV = hrz.ratioH * Math.tan(phi);
    }
    else phi = sign * Math.atan2(hrz.ratioV, hrz.ratioH);
    phi += Math.atan2(p2.Y - center.Y, p2.X - center.X);
    p.X = center.X + this.radius * Math.cos(phi);
    p.Y = center.Y + this.radius * Math.sin(phi);
    let horizontal = [p2.X - p.X, p2.Y - p.Y],
      vertical = [-sign * horizontal[1], sign * horizontal[0]]
    hPoint.X = p.X + horizontal[0] * hrz.ratioH + vertical[0] * hrz.ratioV;
    hPoint.Y = p.Y + horizontal[1] * hrz.ratioH + vertical[1] * hrz.ratioV;
  }

  center(): Point {
    return { X: this.left + this.radius, Y: this.top + this.radius };
  }

  connSide(node2: Node): CircleSide {
    return new CircleSide();
  }

  arrangeSide(side: CircleSide) {
    let center = this.center();
    this.connectors.forEach(connector => {
      if (connector.point !== undefined) return;
      if (connector.self) connector.point = { X: center.X, Y: center.Y - this.radius };
      else {
        let nextCenter = connector.nextNode.center();
        let distance = Math.sqrt(Math.pow(nextCenter.X - center.X, 2) + Math.pow(nextCenter.Y - center.Y, 2));
        connector.point = {
          X: center.X + (nextCenter.X - center.X) * this.radius / distance,
          Y: center.Y + (nextCenter.Y - center.Y) * this.radius / distance
        };
      }
    });
  }

  allSides(): Side[] {
    return [new CircleSide()];
  }
}

class CircleSide extends Side {
  equal(s: CircleSide): boolean {
    return true;
  }
}