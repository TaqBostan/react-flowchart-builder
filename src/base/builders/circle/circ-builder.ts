import NodeBuilder from "../../node-builder";
import { Connector, Horizon, Point, Node } from "../../types";
import Util from "../../util";
import { CircleNode, CircleSide } from "./circ-node";

export default class CircleBuilder extends NodeBuilder<CircleNode> {
  ofType<T>(node: T): boolean {
    return node instanceof CircleNode;
  }
  nodeProto(): void {
    let builder = this
    CircleNode.prototype.setHorizon = function (...params) { builder.setHorizon.apply(this, params) }
    CircleNode.prototype.updatePoints = function (...params) { builder.updatePoints.apply(this, params) }
    CircleNode.prototype.arrangeSide = function (...params) { builder.arrangeSide.apply(this, params) }
    CircleNode.prototype.connSide = function (...params) { return builder.connSide.apply(this, params) }
    CircleNode.prototype.setPoint = function (...params) { builder.setPoint.apply(this, params) };
    CircleNode.prototype.setRatio = function (...params) { builder.setRatio.apply(this, params) };

  }

  setHorizon = function (this: CircleNode, conn: Connector, origin: Point, dest: Point): void {
    if (conn.horizon?.point !== undefined) return;
    let distance = Math.sqrt(Math.pow(dest.X - origin.X, 2) + Math.pow(dest.Y - origin.Y, 2)), center = this.center(),
      vector = [origin.X - center.X, origin.Y - center.Y];
    let point = { X: origin.X + vector[0] * distance / this.radius / 3, Y: origin.Y + vector[1] * distance / this.radius / 3 };
    conn.horizon = { point, ratioH: 0, ratioV: 0 };
  }

  updatePoints = function (this: CircleNode, p: Point, hrz: Horizon, p2: Point, hrz2: Horizon) {
    let center = this.center(), hPoint = hrz.point!, hPoint2 = hrz2.point!, phi: number, sign = p2.X < p.X ? 1 : -1;
    if (hrz.ratioH === 0) {
      hrz.ratioH = this.ratio.h;
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

  arrangeSide = function (this: CircleNode, side: CircleSide) {
    let center = this.center();
    this.connectors.forEach(connector => {
      if (connector.self) connector.point = { X: center.X, Y: center.Y - this.radius };
      else if (connector.point !== undefined) return;
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

  connSide = function (this: CircleNode, node2: Node): CircleSide {
    return new CircleSide();
  }

  setPoint = function (this: CircleNode, conn: Connector, hrzP: Point) {
    let center = this.center(), phi = Math.atan2(hrzP.Y - center.Y, hrzP.X - center.X), ConnP = conn.point!;
    ConnP.X = center.X + this.radius * Math.cos(phi);
    ConnP.Y = center.Y + this.radius * Math.sin(phi);
  }

  setRatio = function (this: CircleNode, conn: Connector) {
    let origin = conn.point!, dest = conn.pairConn!.point!, hrzP = conn.horizon!.point!, sign = dest.X < origin.X ? 1 : -1;
    let horizontal = [dest.X - origin.X, dest.Y - origin.Y], vertical = [-sign * horizontal[1], sign * horizontal[0]];
    let deltaHrzX = hrzP.X - origin.X, deltaHrzY = hrzP.Y - origin.Y;
    conn.horizon!.ratioV = (horizontal[1] * deltaHrzX - horizontal[0] * deltaHrzY) / (vertical[0] * horizontal[1] - vertical[1] * horizontal[0]);
    conn.horizon!.ratioH = (vertical[1] * deltaHrzX - vertical[0] * deltaHrzY) / (horizontal[0] * vertical[1] - horizontal[1] * vertical[0]);
  }

  setSize(n: CircleNode): void {
    n.radius = (14 + Math.max(20, n.label.getBBox().width)) / 2;
    n.box.setAttribute('r', n.radius.toString());
    n.box.setAttribute('cx', n.radius.toString());
    n.box.setAttribute('cy', n.radius.toString());
    n.source.setAttribute('x', (2 * n.radius - 20).toString());
    n.source.setAttribute('y', (n.radius - 6).toString());
  }
}