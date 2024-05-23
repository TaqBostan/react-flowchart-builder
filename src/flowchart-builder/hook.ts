import { useState } from 'react';
import { ConnectorData, NodeData } from '../base/types';

export const useFlowchart = () => {
  const [handles, setHandles] = useState<FlowchartHandles>();
  return { setHandles, flowchart: handles };
};

export type FlowchartHandles = {
  addNode(left: number, top: number, text: string, id?: number): number;
  addNodes(nodes: NodeData[], conns?: ConnectorData[]): void;
  getData(): { nodes: NodeData[], connectors: ConnectorData[] }
  svg: SVGSVGElement;
}