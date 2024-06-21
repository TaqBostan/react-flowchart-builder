import NodeBuilder from "../../node-builder";
import { RhomNode } from "./rhom-node";


export default class RhomBuilder extends NodeBuilder<RhomNode> {
  ofType<T>(node: T): boolean {
    return node instanceof RhomNode;
  }
  setSize(n: RhomNode): void {
    n.box.setAttribute('x', '0');
    n.box.setAttribute('y', '0');
    n.diameter = 30 + Math.max(20, n.label.getBBox().width);
    let points = [[0, n.diameter/2], [n.diameter/2, 0], [n.diameter, n.diameter/2], [n.diameter/2, n.diameter]];
    let strPoints = points.reduce((str, point) => `${str} ${point[0]},${point[1]}`, '');
    n.box.setAttribute('points', strPoints);
    n.source.setAttribute('x', (n.diameter - 25).toString());
    n.source.setAttribute('y', (n.diameter / 2 - 6).toString());
    n.label.setAttribute('x', '15');
    n.label.setAttribute('y', (n.diameter / 2 + n.label.getBBox().height / 2 - 3.5).toString());
  }
}