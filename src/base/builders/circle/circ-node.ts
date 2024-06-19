
import { Node, Point, Side } from "../../types";

export class CircleNode extends Node {
  box: SVGCircleElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle') as SVGCircleElement;
  constructor(public id: number, public left: number, public top: number, public text: string, public radius: number = 0) {
    super(id, left, top, text)
  }

  getHorizon(prevHrz: Point | undefined, origin: Point, dest: Point): Point {
    if(prevHrz !== undefined) return prevHrz;
    let distance = Math.sqrt(Math.pow(dest.X - origin.X, 2) + Math.pow(dest.Y - origin.Y, 2)), center = this.center(),
      vector = [origin.X - center.X, origin.Y - center.Y];
    return { X: origin.X + vector[0] * distance / this.radius / 3, Y: origin.Y + vector[1] * distance / this.radius / 3 };
  }
  
  updatePoints(p: Point, hrz: Point, p2: Point, hrz2: Point) {
    let center = this.center();
    let distance = Math.sqrt(Math.pow(hrz2.X - center.X, 2) + Math.pow(hrz2.Y - center.Y, 2));
    p.X = center.X + (hrz2.X - center.X) * this.radius / distance;
    p.Y = center.Y + (hrz2.Y - center.Y) * this.radius / distance;
    hrz.X = (p.X + hrz2.X) / 2;
    hrz.Y = (p.Y + hrz2.Y) / 2;
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