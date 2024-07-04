import NodeBuilder from "../../node-builder";
import { Connector, Point } from "../../types";
import { RhomNode, RhomSide } from "./rhom-node";


export default class RhomBuilder extends NodeBuilder<RhomNode> {
  ofType<T>(node: T): boolean {
    return node instanceof RhomNode;
  }
  nodeProto(): void {
    let builder = this
    RhomNode.prototype.setHorizon = function (...params) { builder.setHorizon.apply(this, params) }
  }

  setHorizon = function (this: RhomNode, conn: Connector, origin: Point, dest: Point): void {
    if (conn.horizon === undefined) conn.horizon = { ratioH: this.ratio.h, ratioV: this.ratio.v };
    if(conn.horizon.point === undefined) conn.horizon.point ={ X: 0, Y: 0 };
    let hx: number, hy: number, side = conn.side as RhomSide;
    if (side.vertical) {
      hy = (dest.Y - origin.Y) * conn.horizon.ratioH;
      if (Math.abs(hy) < 30) hy = Math.sign(hy) * 30;
      hx = - hy * conn.horizon.ratioV;
    }
    else {
      hx = (dest.X - origin.X) * conn.horizon.ratioH;
      if (Math.abs(hx) < 30) hx = Math.sign(hx) * 30;
      hy = hx * conn.horizon.ratioV;
    }
    conn.horizon.point!.X = origin.X + hx;
    conn.horizon.point!.Y = origin.Y + hy;
  }

  setSize(n: RhomNode): void {
    n.box.setAttribute('x', '0');
    n.box.setAttribute('y', '0');
    n.diameter = 22 + Math.max(20, n.label.getBBox().width);
    let points = [[0, n.diameter / 2], [n.diameter / 2, 0], [n.diameter, n.diameter / 2], [n.diameter / 2, n.diameter]];
    let strPoints = points.reduce((str, point) => `${str} ${point[0]},${point[1]}`, '');
    n.box.setAttribute('points', strPoints);
    n.source.setAttribute('x', (n.diameter - 25).toString());
    n.source.setAttribute('y', (n.diameter / 2 - 6).toString());
    n.label.setAttribute('y', (n.diameter / 2 + n.label.getBBox().height / 2 - 3.5).toString());
  }
}