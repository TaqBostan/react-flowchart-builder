import React, { useRef, useEffect, useMemo, CSSProperties } from 'react';
import { FlowchartHandles } from './hook';
import './index.css';
import Director from '../base/director';
import { ConnectorData, NodeData } from '../base/types';

const Flowchart = (props: FlowchartProps) => {
  const wrapper = useRef<SVGSVGElement>(null);
  const getDirector = () => Director.instance;

  const getHandles = () => ({
    addNode(left: number, top: number, text: string, id?: number) {
      return getDirector().addNode(left, top, text, id);
    },
    addNodes(nodes: NodeData[], conns: ConnectorData[] = []) {
      getDirector().addNodes(nodes, conns);
    },
    getData() {
      return getDirector().getData();
    }
  })

  const onload = React.useCallback((svg: SVGSVGElement) => {
    Director.init(svg);
    props.setHandles({ ...getHandles(), svg });
    props.onReady?.({ ...getHandles(), svg });
  }, []);

  useEffect(() => {
    if (wrapper.current) onload(wrapper.current)
  }, [wrapper, onload]);

  const style: CSSProperties = {
    borderStyle: 'dotted',
    position: 'relative'
  };
  if (props.margin) style.margin = props.margin;
  if (props.height) style.height = props.height;
  if (props.width) style.width = props.width;

  return <svg ref={wrapper} style={style}></svg>;
}

export interface FlowchartProps {
  height?: string;
  width?: string;
  margin?: string;
  onReady?: (annotator: FlowchartHandles) => any;
  setHandles: (handles: FlowchartHandles) => void;
}

export { Flowchart };