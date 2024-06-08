
import { Node, Point, Side } from "../../types";

export class CircleNode extends Node {
  box: SVGCircleElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle') as SVGCircleElement;
  constructor(public id: number, public left: number, public top: number, public text: string, public radius: number = 0) {
    super(id, left, top, text)
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