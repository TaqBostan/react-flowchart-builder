import NodeBuilder from "../../node-builder";
import { CircleNode } from "./circ-node";

export default class CircleBuilder extends NodeBuilder<CircleNode> {
  ofType<T>(node: T): boolean {
    return node instanceof CircleNode;
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