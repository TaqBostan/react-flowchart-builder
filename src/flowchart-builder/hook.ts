import { useState } from 'react';
import { ConnectorData, NodeData } from '../base/types';

export const useFlowchart = () => {
  const [handles, setHandles] = useState<FlowchartHandles>();
  return { setHandles, flowchart: handles };
};

export type FlowchartHandles = {
  addRectNode(left: number, top: number, text: string, id?: number, color?: string): number;
  addCircleNode(left: number, top: number, text: string, id?: number, color?: string): number;
  addRhomNode(left: number, top: number, text: string, id?: number, color?: string): number;
  addNodes(nodes: NodeData[], conns?: ConnectorData[]): void;
  getData(): { nodes: NodeData[], connectors: ConnectorData[] };
  changeConnType(id: number, type: string): void;
  svg: SVGSVGElement;
}