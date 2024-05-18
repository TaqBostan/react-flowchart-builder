import { useState } from 'react';

export const useFlowchart = () => {
  const [handles, setHandles] = useState<FlowchartHandles>();
  return { setHandles, flowchart: handles };
};

export type FlowchartHandles = {
  addNode(left: number, top: number, text: string): void;
  svg: SVGSVGElement;
}