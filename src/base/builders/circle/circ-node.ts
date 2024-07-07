
import { Node, ns, Point, Side } from "../../types";
export class CircleNode extends Node {
  box: SVGCircleElement = document.createElementNS(ns, 'circle') as SVGCircleElement;
  ratio = { h: 0.333, v: 0 };
  constructor(public id: number, public left: number, public top: number, public text: string, public color: string, public radius: number = 0) {
    super(id, left, top, text, color, 'circle');
  }

  center(): Point {
    return { X: this.left + this.radius, Y: this.top + this.radius };
  }

  allSides(): Side[] {
    return [new CircleSide()];
  }

  getHeight(): number {
    return 2 * this.radius;
  }

}

export class CircleSide extends Side {
  equal(s: CircleSide): boolean {
    return true;
  }
}