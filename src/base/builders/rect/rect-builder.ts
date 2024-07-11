import NodeBuilder from "../../node-builder";
import { Connector, Horizon, Point, Side, Node } from "../../types";
import { RectNode, RectSide } from "./rect-node";


export default class RectBuilder extends NodeBuilder<RectNode> {
  ofType<T>(node: T): boolean {
    return node instanceof RectNode;
  }
  nodeProto(): void {
    let builder = this;
    RectNode.prototype.setHorizon = function (...params) { builder.setHorizon.apply(this, params) };
    RectNode.prototype.updatePoints = function (...params) { builder.updatePoints.apply(this, params) };
    RectNode.prototype.arrangeSide = function (...params) { builder.arrangeSide.apply(this, params) };
    RectNode.prototype.connSide = function (...params) { return builder.connSide.apply(this, [...params, builder]) };
    RectNode.prototype.setPoint = function (...params) { builder.setPoint.apply(this, [...params, builder]) };
    RectNode.prototype.setRatio = function (...params) { builder.setRatio.apply(this, params) };
  }

  setHorizon = function (this: RectNode, conn: Connector, origin: Point, dest: Point) {
    if (conn.horizon === undefined) conn.horizon = { ratioH: this.ratio.h, ratioV: this.ratio.v };
    if (conn.horizon.point === undefined) conn.horizon.point = { X: 0, Y: 0 };
    let horizontal = [(dest.X - origin.X) * conn.horizon.ratioH, (dest.Y - origin.Y) * conn.horizon.ratioH],
      sign = horizontal[0] > 0 ? 1 : -1,
      vertical = [sign * horizontal[1] * conn.horizon.ratioV, -sign * horizontal[0] * conn.horizon.ratioV];
    conn.horizon.point!.X = origin.X + horizontal[0] + vertical[0];
    conn.horizon.point!.Y = origin.Y + horizontal[1] + vertical[1];
  }

  updatePoints = function (this: RectNode, p: Point, hrz: Horizon, p2: Point, hrz2: Horizon) { }

  arrangeSide = function (this: RectNode, side: Side) {
    let _side = side as RectSide;
    let sideCenter = this.sideCenter(_side);
    let connectors = this.connectors.filter(c => c.side.equal(_side)), count = connectors.length;
    connectors.forEach(c => {
      if (c.self) c.slope = 0;
      else {
        let nextCenter = c.nextNode.center(), vector = { X: nextCenter.X - sideCenter.X, Y: nextCenter.Y - sideCenter.Y };
        if (_side.vertical) c.slope = vector.Y === 0 ? 1000 * Math.sign(vector.X) : vector.X / vector.Y;
        else c.slope = vector.X === 0 ? 1000 * Math.sign(vector.Y) : vector.Y / vector.X;
      }
    })
    connectors.sort((c1, c2) => _side.firstSide ? (c2.slope - c1.slope) : (c1.slope - c2.slope));
    let dis = Math.min(15, (_side.vertical ? (this.width - 10) / count : (this.height - 10) / count));
    connectors.forEach((connector, i) => {
      connector.point = { ...sideCenter };
      if (_side.vertical) connector.point.X -= ((count - 1) / 2 - i) * dis;
      else connector.point.Y -= ((count - 1) / 2 - i) * dis;
    });
  }

  connSide = function (this: RectNode, node2: Node, builder: RectBuilder): RectSide {
    if (this.id === node2.id) return new RectSide(true, true);
    else return builder.getSide(this.center(), this.height, this.width, node2.center());
  }

  setPoint = function (this: RectNode, conn: Connector, hrzP: Point, builder: RectBuilder) {
    let center = this.center();
    let side = conn.side = builder.getSide(center, this.height, this.width, hrzP), sign = side.firstSide ? -1 : 1;
    let ConnP = conn.point! = this.sideCenter(side);
    let phi = Math.atan2(hrzP.Y - center.Y, hrzP.X - center.X);
    if(side.vertical) ConnP.X += sign * this.height / Math.tan(phi) / 2;
    else ConnP.Y += sign * this.width * Math.tan(phi) / 2;
  }

  setRatio = function (this: RectNode, conn: Connector) {
    let origin = conn.point!, dest = conn.pairConn!.point!, hrzP = conn.horizon!.point!, sign = hrzP.X > origin.X ? 1 : -1;
    let deltaHrzX = hrzP.X - origin.X, deltaHrzY = hrzP.Y - origin.Y, deltaDestX = dest.X - origin.X, deltaDestY = dest.Y - origin.Y;
    conn.horizon!.ratioV = sign * (deltaHrzX * deltaDestY - deltaHrzY * deltaDestX) / (deltaHrzY * deltaDestY + deltaHrzX * deltaDestX)
    conn.horizon!.ratioH = deltaHrzX / (deltaDestX + sign * deltaDestY * conn.horizon!.ratioV);
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
  }

  getSide(c: Point, h: number, w: number, hrzP: Point) {
    let vertical = Math.abs(hrzP.Y - c.Y) * w > Math.abs(hrzP.X - c.X) * h;
    let firstSide = vertical ? (hrzP.Y < c.Y) : (hrzP.X < c.X);
    return new RectSide(vertical, firstSide);
  }
}
