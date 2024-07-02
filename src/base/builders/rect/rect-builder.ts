import NodeBuilder from "../../node-builder";
import { Connector, Point } from "../../types";
import { RectNode } from "./rect-node";


export default class RectBuilder extends NodeBuilder<RectNode> {
  ofType<T>(node: T): boolean {
    return node instanceof RectNode;
  }
  setPrototype(): void {
    let builder = this
    RectNode.prototype.setHorizon = function (...params) { builder.setHorizon.apply(this, params) }
  }

  setHorizon = function (this: RectNode, conn: Connector, origin: Point, dest: Point) {
    if (conn.horizon === undefined) conn.horizon = { ratioH: this.ratio.h, ratioV: this.ratio.v };    
    if(conn.horizon.point === undefined) conn.horizon.point ={ X: 0, Y: 0 };
    let horizontal = [(dest.X - origin.X) * conn.horizon.ratioH, (dest.Y - origin.Y) * conn.horizon.ratioH],
      sign = horizontal[0] > 0 ? 1 : -1,
      vertical = [sign * horizontal[1] * conn.horizon.ratioV, -sign * horizontal[0] * conn.horizon.ratioV];
    conn.horizon.point!.X = origin.X + horizontal[0] + vertical[0];
    conn.horizon.point!.Y = origin.Y + horizontal[1] + vertical[1];
  }
  
  setSize(n: RectNode): void {
    n.box.setAttribute('x', '0');
    n.box.setAttribute('y', '0');
    n.box.setAttribute('height', n.height.toString());
    n.box.setAttribute('rx', '5');
    n.width = 14 + Math.max(20, n.label.getBBox().width);
    n.box.setAttribute('width', n.width.toString());
    n.source.setAttribute('x', (n.width - 20).toString());
    n.source.setAttribute('y', '9.5');
    n.label.setAttribute('y', (n.height / 2 + n.label.getBBox().height / 2 - 3.5).toString());
  }
}