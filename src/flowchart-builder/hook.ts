import { useState } from 'react';
import { ConnectorData, NodeData } from '../base/types';

export const useFlowchart = () => {
  const [handles, setHandles] = useState<FlowchartHandles>();
  return { setHandles, flowchart: handles };
};

export type FlowchartHandles = {
  addRectNode(left: number, top: number, text: string, id?: number): number;
  addCircleNode(left: number, top: number, text: string, id?: number): number;
  addRhomNode(left: number, top: number, text: string, id?: number): number;
  addNodes(nodes: NodeData[], conns?: ConnectorData[]): void;
  getData(): { nodes: NodeData[], connectors: ConnectorData[] };
  changeConnType(id: number, type: string): void;
  svg: SVGSVGElement;
}