import React, { useRef, useEffect, CSSProperties } from 'react';
import { FlowchartHandles } from './hook';
import './index.css';
import Director from '../base/director';
import { ConnectorData, NodeData } from '../base/types';
import { RectNode } from '../base/builders/rect/rect-node';
import { CircleNode } from '../base/builders/circle/circ-node';
import { RhomNode } from '../base/builders/rhom/rhom-node';

const Flowchart = (props: FlowchartProps) => {
  const wrapper = useRef<SVGSVGElement>(null);
  const getDirector = () => Director.instance;

  const getHandles = () => ({
    addRectNode(left: number, top: number, text: string, id?: number) {
      return getDirector().addNode(new RectNode(id || 0, left, top, text));
    },
    addCircleNode(left: number, top: number, text: string, id?: number) {
      return getDirector().addNode(new CircleNode(id || 0, left, top, text));
    },
    addRhomNode(left: number, top: number, text: string, id?: number) {
      return getDirector().addNode(new RhomNode(id || 0, left, top, text));
    },
    addNodes(nodes: NodeData[], conns: ConnectorData[] = []) {
      let rectangles = nodes.filter(n => !n.shape || n.shape === 'rectangle').map(n => new RectNode(n.id || 0, n.X, n.Y, n.text))
      let circles = nodes.filter(n => n.shape === 'circle').map(n => new CircleNode(n.id || 0, n.X, n.Y, n.text))
      let rhombuses = nodes.filter(n => n.shape === 'rhombus').map(n => new RhomNode(n.id || 0, n.X, n.Y, n.text))
      getDirector().addNodes(rectangles);
      getDirector().addNodes(circles);
      getDirector().addNodes(rhombuses);
      getDirector().addConns(conns);
    },
    getData() {
      return getDirector().getData();
    },
    changeConnType(id: number, type: string) {
      getDirector().changeConnType(id, type);
    }
  })

  const onload = React.useCallback((svg: SVGSVGElement) => {
    Director.init(svg, props.editable);
    props.setHandles({ ...getHandles(), svg });
    props.onReady?.({ ...getHandles(), svg });
  }, []);

  useEffect(() => {
    if (wrapper.current) onload(wrapper.current)
  }, [wrapper, onload]);

  const wrapperCss: CSSProperties = {
    height: props.height,
    width: props.width
  };

  return (
    <div style={wrapperCss} className='wp-svg'>
      <svg ref={wrapper} style={{ top: 0, left: 0 }} className='the-svg'>
        <defs>
          <filter id="flt" width="2" height="2">
            <feOffset in="SourceAlpha" dx="1.5" dy="1.5" />
            <feGaussianBlur stdDeviation="2" />
            <feBlend in="SourceGraphic" in2="blurOut" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export interface FlowchartProps {
  height: string;
  width: string;
  editable?: boolean;
  onReady?: (annotator: FlowchartHandles) => any;
  setHandles: (handles: FlowchartHandles) => void;
}

export { Flowchart };