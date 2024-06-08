import NodeBuilder from "../../node-builder";
import { RectNode } from "./rect-node";


export default class RectBuilder extends NodeBuilder<RectNode> {
  ofType<T>(node: T): boolean {
    return node instanceof RectNode;
  }
  setSize(n: RectNode): void {
    n.box.setAttribute('x', '0');
    n.box.setAttribute('y', '0');
    n.box.setAttribute('height', n.height.toString());
    n.box.setAttribute('rx', '5');
    n.width = 20 + Math.max(20, n.label.getBBox().width);
    n.box.setAttribute('width', n.width.toString());
    n.source.setAttribute('x', (n.width - 20).toString());
    n.label.setAttribute('y', (n.height / 2 + n.label.getBBox().height / 2 - 3.5).toString());
  }
}