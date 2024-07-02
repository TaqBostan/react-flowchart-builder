import NodeBuilder from "../../node-builder";
import { Connector, Point } from "../../types";
import { CircleNode } from "./circ-node";

export default class CircleBuilder extends NodeBuilder<CircleNode> {
  ofType<T>(node: T): boolean {
    return node instanceof CircleNode;
  }
  setPrototype(): void {
    let builder = this
    CircleNode.prototype.setHorizon = function (...params) { builder.setHorizon.apply(this, params) }
  }

  setHorizon = function (this: CircleNode, conn: Connector, origin: Point, dest: Point): void {
    if (conn.horizon?.point !== undefined) return;
    let distance = Math.sqrt(Math.pow(dest.X - origin.X, 2) + Math.pow(dest.Y - origin.Y, 2)), center = this.center(),
      vector = [origin.X - center.X, origin.Y - center.Y];
    let point = { X: origin.X + vector[0] * distance / this.radius / 3, Y: origin.Y + vector[1] * distance / this.radius / 3 };
    conn.horizon = { point, ratioH: 0, ratioV: 0 };
  }
  setSize(n: CircleNode): void {
    n.radius = (14 + Math.max(20, n.label.getBBox().width)) / 2;
    n.box.setAttribute('r', n.radius.toString());
    n.box.setAttribute('cx', n.radius.toString());
    n.box.setAttribute('cy', n.radius.toString());
    n.source.setAttribute('x', (2 * n.radius - 20).toString());
    n.source.setAttribute('y', (n.radius - 6).toString());
    n.label.setAttribute('y', (n.radius + n.label.getBBox().height / 2 - 3.5).toString());
  }
}